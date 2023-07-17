import httpStatus from "http-status";
import { ApiError } from "../../../errors/apiError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from "./auth.interface";
import { createToken, verifyToken } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";

export const createUserToDB = async (user: IUser): Promise<IUser> => {
  // set role
  user.role = "user";
  const createdUser = await User.create(user);
  if (createdUser) {
    return createdUser;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create user!");
  }
};

export const loginUserFromDB = async (
  payload: ILoginUser
): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await User.isUserExist(email);
  if (!isUserExist) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User does not exist with this email"
    );
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
  }

  //create access token & refresh token
  const { _id, role, name } = isUserExist;
  const accessToken = createToken(
    { _id, role, email, name },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = createToken(
    { _id, role, email, name },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const refreshTokenUserFromDB = async (
  token: string
): Promise<IRefreshTokenResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = verifyToken(token, config.jwt.refresh_secret as Secret);
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid Refresh Token");
  }

  const { email, name } = verifiedToken;

  // tumi delete hye gso  kintu tumar refresh token ase
  // checking deleted user's refresh token
  const isUserExist = await User.isUserExist(email);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  //generate new token
  const newAccessToken = createToken(
    {
      _id: isUserExist._id,
      role: isUserExist.role,
      email,
      name,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};
