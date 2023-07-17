import httpStatus from "http-status";
import { ApiError } from "../../../errors/apiError";
import { IBook, IBookFilters } from "./book.interface";
import { Book } from "./book.model";
import { User } from "../user/user.model";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { bookSearchableFields } from "./book.constant";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

export const createBookToDB = async (
  user: JwtPayload | null,
  payload: IBook
): Promise<IBook> => {
  // set postedBy
  payload.postedBy = user?._id;

  const result = await Book.create(payload);
  return result;
};

export const getAllBookFromDB = async (
  filters: IBookFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IBook[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: bookSearchableFields.map(field => ({
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

  const result = await Book.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const count = await Book.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};

export const getSingleBookFromDB = async (
  id: string
): Promise<IBook | null> => {
  const result = await Book.findById(id);
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Book not found with this id. Please provide a valid book id"
    );
  }
  return result;
};

export const updateSingleBookToDB = async (
  user: JwtPayload | null,
  id: string,
  payload: Partial<IBook>
): Promise<IBook | null> => {
  // handle user authorization
  if (user) {
    const authorizedUser = await Book.findOne({ _id: id, postedBy: user._id });

    if (!authorizedUser) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized / owner of this book"
      );
    }
  }

  // handle user validation
  if (payload.postedBy) {
    const isExit = await User.findOne({
      _id: payload.postedBy,
      role: "user",
    });

    if (!isExit) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "User not found with this postedBy id. Please provide a valid user id"
      );
    }
  }

  const result = await Book.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Failed to update book / Book not found with this id. Please provide a valid book id"
    );
  }
  return result;
};

export const deleteSingleBookFromDB = async (
  user: JwtPayload | null,
  id: string
): Promise<IBook | null> => {
  if (user) {
    const authorizedUser = await Book.findOne({ _id: id, postedBy: user._id });

    if (!authorizedUser) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized / owner of this book"
      );
    }
  }

  const result = await Book.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Failed to delete book / Book not found with this id. Please provide a valid book id"
    );
  }
  return result;
};
