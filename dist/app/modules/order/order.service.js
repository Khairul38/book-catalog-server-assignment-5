"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrderFromDB =
  exports.getSingleOrderFromDB =
  exports.createOrderToDB =
    void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const order_model_1 = require("./order.model");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const apiError_1 = require("../../../errors/apiError");
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../user/user.model");
const cow_model_1 = require("../cow/cow.model");
const createOrderToDB = payload =>
  __awaiter(void 0, void 0, void 0, function* () {
    const isBuyer = yield user_model_1.User.findOne({
      _id: payload.buyer,
      role: "buyer",
    });
    const isCow = yield cow_model_1.Cow.findById(payload.cow);
    if (!isBuyer) {
      throw new apiError_1.ApiError(
        http_status_1.default.NOT_FOUND,
        "Buyer not found with this id. Please provide a valid buyer id"
      );
    } else if (!isCow) {
      throw new apiError_1.ApiError(
        http_status_1.default.NOT_FOUND,
        "Cow not found with this id. Please provide a valid cow id"
      );
    } else if (isCow.label === "sold out") {
      throw new apiError_1.ApiError(
        http_status_1.default.BAD_REQUEST,
        "This cow is sold out. Please buy another cow"
      );
    } else if (isBuyer.budget < isCow.price) {
      throw new apiError_1.ApiError(
        http_status_1.default.BAD_REQUEST,
        "You need more money to buy this cow"
      );
    }
    let newOrderAllData = null;
    const session = yield mongoose_1.default.startSession();
    try {
      session.startTransaction();
      const updateCow = yield cow_model_1.Cow.findOneAndUpdate(
        { _id: payload.cow },
        { label: "sold out" },
        {
          new: true,
        }
      );
      if (!updateCow) {
        throw new apiError_1.ApiError(
          http_status_1.default.BAD_REQUEST,
          "Failed to update cow label"
        );
      }
      const updateBuyer = yield user_model_1.User.findOneAndUpdate(
        { _id: payload.buyer },
        { budget: isBuyer.budget - isCow.price },
        {
          new: true,
        }
      );
      if (!updateBuyer) {
        throw new apiError_1.ApiError(
          http_status_1.default.BAD_REQUEST,
          "Failed to update buyer budget"
        );
      }
      const updateSeller = yield user_model_1.User.findOneAndUpdate(
        { _id: isCow.seller },
        { $inc: { income: isCow.price } },
        {
          new: true,
        }
      );
      if (!updateSeller) {
        throw new apiError_1.ApiError(
          http_status_1.default.BAD_REQUEST,
          "Failed to update seller income"
        );
      }
      const newOrder = yield order_model_1.Order.create([payload], { session });
      if (!newOrder.length) {
        throw new apiError_1.ApiError(
          http_status_1.default.BAD_REQUEST,
          "Failed to create order"
        );
      }
      newOrderAllData = newOrder[0];
      yield session.commitTransaction();
      yield session.endSession();
    } catch (error) {
      yield session.abortTransaction();
      yield session.endSession();
      throw error;
    }
    if (newOrderAllData) {
      newOrderAllData = yield order_model_1.Order.findById(
        newOrderAllData._id
      ).populate([
        { path: "cow", populate: { path: "seller" } },
        { path: "buyer" },
      ]);
    }
    return newOrderAllData;
  });
exports.createOrderToDB = createOrderToDB;
const getSingleOrderFromDB = (user, id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.findById(id).populate([
      { path: "cow", populate: { path: "seller" } },
      { path: "buyer" },
    ]);
    const orderResult = yield order_model_1.Order.findById(id);
    const cowResult = yield cow_model_1.Cow.findById(
      orderResult && orderResult.cow
    );
    if (!result) {
      throw new apiError_1.ApiError(
        http_status_1.default.NOT_FOUND,
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
      throw new apiError_1.ApiError(
        http_status_1.default.UNAUTHORIZED,
        "You are not authorized / owner of this order"
      );
    }
  });
exports.getSingleOrderFromDB = getSingleOrderFromDB;
const getAllOrderFromDB = (
  // filters: ICowFilters,
  user,
  paginationOptions
) =>
  __awaiter(void 0, void 0, void 0, function* () {
    // const { searchTerm, ...filtersData } = filters;
    const { page, limit, skip, sortBy, sortOrder } = (0,
    paginationHelper_1.calculatePagination)(paginationOptions);
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
    const sortConditions = {};
    if (sortBy && sortOrder) {
      sortConditions[sortBy] = sortOrder;
    }
    // const whereCondition =
    //   andConditions.length > 0 ? { $and: andConditions } : {};
    let whereCondition = {};
    if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
      whereCondition = {};
    } else if (
      (user === null || user === void 0 ? void 0 : user.role) === "buyer"
    ) {
      whereCondition = {
        buyer: user === null || user === void 0 ? void 0 : user._id,
      };
    } else {
      const sellerCows = yield cow_model_1.Cow.find(
        { seller: user === null || user === void 0 ? void 0 : user._id },
        { _id: 1 }
      ).lean();
      whereCondition = { cow: { $in: sellerCows.map(cow => cow._id) } };
    }
    const result = yield order_model_1.Order.find(whereCondition)
      .populate([
        { path: "cow", populate: { path: "seller" } },
        { path: "buyer" },
      ])
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);
    const count = yield order_model_1.Order.countDocuments(whereCondition);
    return {
      meta: {
        page,
        limit,
        count,
      },
      data: result,
    };
  });
exports.getAllOrderFromDB = getAllOrderFromDB;
