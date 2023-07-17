import httpStatus from "http-status";
import { ApiError } from "../../../errors/apiError";
import {
  IAdmin,
  ILoginAdmin,
  ILoginAdminResponse,
  IRefreshTokenAdminResponse,
} from "./admin.interface";
import { Admin } from "./admin.model";
import { createToken, verifyToken } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { JwtPayload, Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";

export const createAdminToDB = async (admin: IAdmin): Promise<IAdmin> => {
  const createdAdmin = await Admin.create(admin);

  if (createdAdmin) {
    return createdAdmin;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create admin!");
  }
};

export const loginAdminFromDB = async (
  payload: ILoginAdmin
): Promise<ILoginAdminResponse> => {
  const { phoneNumber, password } = payload;

  const isAdminExist = await Admin.isAdminExist(phoneNumber);
  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin does not exist");
  }

  if (
    isAdminExist.password &&
    !(await Admin.isPasswordMatched(password, isAdminExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
  }

  //create access token & refresh token
  const { _id, role } = isAdminExist;
  const accessToken = createToken(
    { _id, role, phoneNumber },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = createToken(
    { _id, role, phoneNumber },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const getAdminProfileFromDB = async (
  admin: JwtPayload | null
): Promise<IAdmin | null> => {
  const result = await Admin.findById(admin?._id);
  if (result) {
    return result;
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }
};

export const updateAdminProfileToDB = async (
  admin: JwtPayload | null,
  payload: Partial<IAdmin>
): Promise<IAdmin | null> => {
  const { name, ...adminData } = payload;
  if (adminData.phoneNumber) {
    const isExist = await Admin.findOne({ phoneNumber: adminData.phoneNumber });
    if (isExist) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "Another admin already exists with this phone number. Please provide a new phone number."
      );
    }
  }

  const updatedAdminData: Partial<IAdmin> = { ...adminData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IAdmin>; // `name.firstName`
      (updatedAdminData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  // hash password before update
  if (adminData.password) {
    updatedAdminData.password = await bcrypt.hash(
      adminData.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  const result = await Admin.findOneAndUpdate(
    { _id: admin?._id },
    updatedAdminData,
    {
      new: true,
    }
  );
  if (result) {
    return result;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to update admin");
  }
};

export const refreshTokenAdminFromDB = async (
  token: string
): Promise<IRefreshTokenAdminResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = verifyToken(token, config.jwt.refresh_secret as Secret);
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid Refresh Token");
  }

  const { phoneNumber } = verifiedToken;

  // tumi delete hye gso  kintu tumar refresh token ase
  // checking deleted user's refresh token
  const isAdminExist = await Admin.isAdminExist(phoneNumber);
  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin does not exist");
  }

  //generate new token
  const newAccessToken = createToken(
    {
      _id: isAdminExist._id,
      role: isAdminExist.role,
      phoneNumber,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};
