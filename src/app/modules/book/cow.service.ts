import httpStatus from "http-status";
import { ApiError } from "../../../errors/apiError";
import { ICow, ICowFilters } from "./book.interface";
import { Cow } from "./cow.model";
import { User } from "../user/user.model";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { cowSearchableFields } from "./cow.constant";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

export const createCowToDB = async (payload: ICow): Promise<ICow> => {
  // handle seller validation
  const isExit = await User.findOne({
    _id: payload.seller,
    role: "seller",
  });

  if (!isExit) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Seller not found with this id. Please provide a valid seller id"
    );
  }
  if (!payload.label) {
    payload.label = "for sale";
  }

  const result = await Cow.create(payload);
  return result;
};

export const getAllCowFromDB = async (
  filters: ICowFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICow[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: cowSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        if (field === "minPrice") {
          return { price: { $gte: Number(value) } };
        } else if (field === "maxPrice") {
          return { price: { $lte: Number(value) } };
        } else {
          return { [field]: value };
        }
      }),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Cow.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const count = await Cow.countDocuments();

  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};

export const getSingleCowFromDB = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findById(id);
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Cow not found with this id. Please provide a valid cow id"
    );
  }
  return result;
};

export const updateSingleCowToDB = async (
  user: JwtPayload | null,
  id: string,
  payload: Partial<ICow>
): Promise<ICow | null> => {
  // handle seller authorization
  if (user) {
    const authorizedSeller = await Cow.findOne({ _id: id, seller: user._id });

    if (!authorizedSeller) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized / owner of the cow"
      );
    }
  }

  // handle seller validation
  if (payload.seller) {
    const isExit = await User.findOne({
      _id: payload.seller,
      role: "seller",
    });

    if (!isExit) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Seller not found with this id. Please provide a valid seller id"
      );
    }
  }

  const result = await Cow.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Cow not found with this id. Please provide a valid cow id"
    );
  }
  return result;
};

export const deleteSingleCowFromDB = async (
  user: JwtPayload | null,
  id: string
): Promise<ICow | null> => {
  if (user) {
    const authorizedSeller = await Cow.findOne({ _id: id, seller: user._id });

    if (!authorizedSeller) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized / owner of the cow"
      );
    }
  }

  const result = await Cow.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Cow not found with this id. Please provide a valid cow id"
    );
  }
  return result;
};
