import { SortOrder } from "mongoose";
import { IWishlist, IWishlistFilters } from "./wishlist.interface";
import { Wishlist } from "./wishlist.model";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { ApiError } from "../../../errors/apiError";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import { Book } from "../book/book.model";
import { JwtPayload } from "jsonwebtoken";
import { wishlistSearchableFields } from "./wishlist.constant";

export const createWishlistToDB = async (
  payload: IWishlist
): Promise<IWishlist | null> => {
  const isUser = await User.findOne({
    _id: payload.user,
    role: "user",
  });
  const isBook = await Book.findById(payload.book);

  if (!isUser) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User not found with this id. Please provide a valid User id"
    );
  } else if (!isBook) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Book not found with this id. Please provide a valid book id"
    );
  }

  // set status
  payload.status = "Wishlisted";

  const result = await Wishlist.create(payload);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create Wishlist");
  }

  return result;

  // let newOrderAllData = null;
  // const session = await mongoose.startSession();
  // try {
  //   session.startTransaction();
  //   const updateCow = await Book.findOneAndUpdate(
  //     { _id: payload.cow },
  //     { label: "sold out" },
  //     {
  //       new: true,
  //     }
  //   );
  //   if (!updateCow) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, "Failed to update cow label");
  //   }

  //   const updateBuyer = await User.findOneAndUpdate(
  //     { _id: payload.buyer },
  //     { budget: isUser.budget - isBook.price },
  //     {
  //       new: true,
  //     }
  //   );
  //   if (!updateBuyer) {
  //     throw new ApiError(
  //       httpStatus.BAD_REQUEST,
  //       "Failed to update buyer budget"
  //     );
  //   }

  //   const updateSeller = await User.findOneAndUpdate(
  //     { _id: isBook.seller },
  //     { $inc: { income: isBook.price } },
  //     {
  //       new: true,
  //     }
  //   );
  //   if (!updateSeller) {
  //     throw new ApiError(
  //       httpStatus.BAD_REQUEST,
  //       "Failed to update seller income"
  //     );
  //   }

  //   const newOrder = await Wishlist.create([payload], { session });

  //   if (!newOrder.length) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create order");
  //   }
  //   newOrderAllData = newOrder[0];

  //   await session.commitTransaction();
  //   await session.endSession();
  // } catch (error) {
  //   await session.abortTransaction();
  //   await session.endSession();
  //   throw error;
  // }

  // if (newOrderAllData) {
  //   newOrderAllData = await Wishlist.findById(newOrderAllData._id).populate([
  //     { path: "cow", populate: { path: "seller" } },
  //     { path: "buyer" },
  //   ]);
  // }
  // return newOrderAllData;
};

export const getSingleWishlistByBookIdFromDB = async (
  user: JwtPayload | null,
  id: string
): Promise<IWishlist | null> => {
  const result = await Wishlist.findOne({ book: id, user: user?._id });

  if (!result) {
    throw new ApiError(
      httpStatus.NO_CONTENT,
      "Wishlist not found with this id / You are not authorized or owner of this wishlist"
    );
  } else {
    return result;
  }
};

export const getAllWishlistByUserFromDB = async (
  user: JwtPayload | null,
  filters: IWishlistFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IWishlist[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: wishlistSearchableFields.map(field => ({
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
    andConditions.length > 0
      ? { $and: [{ user: user?._id }, ...andConditions] }
      : { $and: [{ user: user?._id }] };

  const result = await Wishlist.find(whereCondition)
    .populate([
      { path: "book", populate: { path: "postedBy" } },
      { path: "user" },
    ])
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const count = await Wishlist.countDocuments(whereCondition);
  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};

export const getAllWishlistFromDB = async (
  user: JwtPayload | null,
  filters: IWishlistFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IWishlist[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: wishlistSearchableFields.map(field => ({
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

  const result = await Wishlist.find(whereCondition)
    .populate([
      { path: "book", populate: { path: "postedBy" } },
      { path: "user" },
    ])
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const count = await Wishlist.countDocuments(whereCondition);
  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};

export const updateSingleWishlistToDB = async (
  user: JwtPayload | null,
  id: string,
  payload: Partial<IWishlist>
): Promise<IWishlist | null> => {
  // handle user authorization
  console.log(payload, id, user?._id);
  if (user) {
    const authorizedUser = await Wishlist.findOne({ _id: id, user: user._id });

    if (!authorizedUser) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized / owner of this wishlist"
      );
    }
  }

  // handle user validation
  if (payload.user) {
    const isExit = await User.findOne({
      _id: payload.user,
      role: "user",
    });

    if (!isExit) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "User not found with this id. Please provide a valid user id"
      );
    }
  }

  const result = await Wishlist.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Failed to update wishlist / Wishlist not found with this id. Please provide a valid wishlist id"
    );
  }
  return result;
};

export const deleteSingleWishlistFromDB = async (
  user: JwtPayload | null,
  id: string
): Promise<IWishlist | null> => {
  if (user) {
    const authorizedUser = await Wishlist.findOne({ _id: id, user: user._id });

    if (!authorizedUser) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized / owner of this wishlist"
      );
    }
  }

  const result = await Wishlist.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Failed to delete wishlist / Wishlist not found with this id. Please provide a valid wishlist id"
    );
  }
  return result;
};
