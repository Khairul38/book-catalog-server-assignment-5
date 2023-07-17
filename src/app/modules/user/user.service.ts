import { SortOrder } from "mongoose";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { userSearchableFields } from "./user.constant";
import { IUser, IUserFilters } from "./user.interface";
import { User } from "./user.model";
import { ApiError } from "../../../errors/apiError";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../../../config";

export const getProfileFromDB = async (
  user: JwtPayload | null
): Promise<IUser | null> => {
  const result = await User.findById(user?._id);
  if (result) {
    return result;
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
};

export const updateProfileToDB = async (
  user: JwtPayload | null,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const { name, ...userData } = payload;
  if (userData.email) {
    const isExist = await User.findOne({ email: userData.email });
    if (isExist) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "Another user already exists with this email. Please provide a new email."
      );
    }
  }

  const updatedUserData: Partial<IUser> = { ...userData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser>; // `name.firstName`
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  // hash password before update
  if (userData.password) {
    updatedUserData.password = await bcrypt.hash(
      userData.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  const result = await User.findOneAndUpdate(
    { _id: user?._id },
    updatedUserData,
    {
      new: true,
    }
  );
  if (result) {
    return result;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to update user");
  }
};

export const getAllUserFromDB = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: userSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await User.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const count = await User.countDocuments();

  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};

export const getSingleUserFromDB = async (
  id: string
): Promise<IUser | null> => {
  const result = await User.findById(id);
  if (result) {
    return result;
  } else {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User not found with this id. Please provide a valid user id"
    );
  }
};

export const updateSingleUserToDB = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const { name, ...userData } = payload;
  if (userData.email) {
    const isExist = await User.findOne({ email: userData.email });
    if (isExist) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "Another user already exists with this email. Please provide a new email."
      );
    }
  }

  const updatedUserData: Partial<IUser> = { ...userData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser>; // `name.firstName`
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  // hash password before update
  if (userData.password) {
    updatedUserData.password = await bcrypt.hash(
      userData.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  const result = await User.findOneAndUpdate({ _id: id }, updatedUserData, {
    new: true,
  });
  if (result) {
    return result;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to update user");
  }
};

export const deleteSingleUserFromDB = async (
  id: string
): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete(id);
  if (result) {
    return result;
  } else {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User not found with this id. Please provide a valid user id"
    );
  }
};
