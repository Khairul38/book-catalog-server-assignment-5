import mongoose, { SortOrder } from "mongoose";
import { IOrder } from "./order.interface";
import { Order } from "./order.model";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { ApiError } from "../../../errors/apiError";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import { Cow } from "../cow/cow.model";
import { JwtPayload } from "jsonwebtoken";

export const createOrderToDB = async (
  payload: IOrder
): Promise<IOrder | null> => {
  const isBuyer = await User.findOne({
    _id: payload.buyer,
    role: "buyer",
  });
  const isCow = await Cow.findById(payload.cow);

  if (!isBuyer) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Buyer not found with this id. Please provide a valid buyer id"
    );
  } else if (!isCow) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Cow not found with this id. Please provide a valid cow id"
    );
  } else if (isCow.label === "sold out") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This cow is sold out. Please buy another cow"
    );
  } else if (isBuyer.budget < isCow.price) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You need more money to buy this cow"
    );
  }

  let newOrderAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const updateCow = await Cow.findOneAndUpdate(
      { _id: payload.cow },
      { label: "sold out" },
      {
        new: true,
      }
    );
    if (!updateCow) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to update cow label");
    }

    const updateBuyer = await User.findOneAndUpdate(
      { _id: payload.buyer },
      { budget: isBuyer.budget - isCow.price },
      {
        new: true,
      }
    );
    if (!updateBuyer) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Failed to update buyer budget"
      );
    }

    const updateSeller = await User.findOneAndUpdate(
      { _id: isCow.seller },
      { $inc: { income: isCow.price } },
      {
        new: true,
      }
    );
    if (!updateSeller) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Failed to update seller income"
      );
    }

    const newOrder = await Order.create([payload], { session });

    if (!newOrder.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create order");
    }
    newOrderAllData = newOrder[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newOrderAllData) {
    newOrderAllData = await Order.findById(newOrderAllData._id).populate([
      { path: "cow", populate: { path: "seller" } },
      { path: "buyer" },
    ]);
  }
  return newOrderAllData;
};

export const getSingleOrderFromDB = async (
  user: JwtPayload | null,
  id: string
): Promise<IOrder | null> => {
  const result = await Order.findById(id).populate([
    { path: "cow", populate: { path: "seller" } },
    { path: "buyer" },
  ]);
  const orderResult = await Order.findById(id);
  const cowResult = await Cow.findById(orderResult && orderResult.cow);

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Order not found with this id. Please provide a valid cow id"
    );
  } else if (user && user.role === "admin") {
    return result;
  } else if (
    user &&
    user.role === "buyer" &&
    user._id === (orderResult && orderResult.buyer.toString())
  ) {
    return result;
  } else if (
    user &&
    user.role === "seller" &&
    user._id === (cowResult && cowResult.seller.toString())
  ) {
    return result;
  } else {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized / owner of this order"
    );
  }
};

export const getAllOrderFromDB = async (
  // filters: ICowFilters,
  user: JwtPayload | null,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IOrder[]>> => {
  // const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);

  // const andConditions = [];

  // if (searchTerm) {
  //   andConditions.push({
  //     $or: cowSearchableFields.map(field => ({
  //       [field]: {
  //         $regex: searchTerm,
  //         $options: "i",
  //       },
  //     })),
  //   });
  // }

  // if (Object.keys(filtersData).length) {
  //   andConditions.push({
  //     $and: Object.entries(filtersData).map(([field, value]) => {
  //       if (field === "minPrice") {
  //         return { price: { $gte: Number(value) } };
  //       } else if (field === "maxPrice") {
  //         return { price: { $lte: Number(value) } };
  //       } else {
  //         return { [field]: value };
  //       }
  //     }),
  //   });
  // }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // const whereCondition =
  //   andConditions.length > 0 ? { $and: andConditions } : {};

  let whereCondition = {};

  if (user?.role === "admin") {
    whereCondition = {};
  } else if (user?.role === "buyer") {
    whereCondition = { buyer: user?._id };
  } else {
    const sellerCows = await Cow.find({ seller: user?._id }, { _id: 1 }).lean();
    whereCondition = { cow: { $in: sellerCows.map(cow => cow._id) } };
  }

  const result = await Order.find(whereCondition)
    .populate([
      { path: "cow", populate: { path: "seller" } },
      { path: "buyer" },
    ])
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const count = await Order.countDocuments(whereCondition);
  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};
