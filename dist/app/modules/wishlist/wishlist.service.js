"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleWishlistFromDB = exports.updateSingleWishlistToDB = exports.getAllWishlistFromDB = exports.getAllWishlistByUserFromDB = exports.getSingleWishlistFromDB = exports.createWishlistToDB = void 0;
const wishlist_model_1 = require("./wishlist.model");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const apiError_1 = require("../../../errors/apiError");
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../user/user.model");
const book_model_1 = require("../book/book.model");
const wishlist_constant_1 = require("./wishlist.constant");
const createWishlistToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUser = yield user_model_1.User.findOne({
        _id: payload.user,
        role: "user",
    });
    const isBook = yield book_model_1.Book.findById(payload.book);
    if (!isUser) {
        throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "User not found with this id. Please provide a valid User id");
    }
    else if (!isBook) {
        throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "Book not found with this id. Please provide a valid book id");
    }
    // set status
    payload.status = "Wishlisted";
    const result = yield wishlist_model_1.Wishlist.create(payload);
    if (!result) {
        throw new apiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Failed to create Wishlist");
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
});
exports.createWishlistToDB = createWishlistToDB;
const getSingleWishlistFromDB = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wishlist_model_1.Wishlist.findOne({ _id: id, user: user === null || user === void 0 ? void 0 : user._id });
    if (!result) {
        throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "Wishlist not found with this id / You are not authorized or owner of this wishlist");
    }
    else {
        return result;
    }
});
exports.getSingleWishlistFromDB = getSingleWishlistFromDB;
const getAllWishlistByUserFromDB = (user, filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: wishlist_constant_1.wishlistSearchableFields.map(field => ({
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
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereCondition = andConditions.length > 0
        ? [{ user: user === null || user === void 0 ? void 0 : user._id }, { $and: andConditions }]
        : {};
    const result = yield wishlist_model_1.Wishlist.find(whereCondition)
        .populate([
        { path: "book", populate: { path: "postedBy" } },
        { path: "user" },
    ])
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const count = yield wishlist_model_1.Wishlist.countDocuments(whereCondition);
    return {
        meta: {
            page,
            limit,
            count,
        },
        data: result,
    };
});
exports.getAllWishlistByUserFromDB = getAllWishlistByUserFromDB;
const getAllWishlistFromDB = (user, filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: wishlist_constant_1.wishlistSearchableFields.map(field => ({
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
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereCondition = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield wishlist_model_1.Wishlist.find(whereCondition)
        .populate([
        { path: "book", populate: { path: "postedBy" } },
        { path: "user" },
    ])
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const count = yield wishlist_model_1.Wishlist.countDocuments(whereCondition);
    return {
        meta: {
            page,
            limit,
            count,
        },
        data: result,
    };
});
exports.getAllWishlistFromDB = getAllWishlistFromDB;
const updateSingleWishlistToDB = (user, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // handle user authorization
    if (user) {
        const authorizedUser = yield wishlist_model_1.Wishlist.findOne({ _id: id, user: user._id });
        if (!authorizedUser) {
            throw new apiError_1.ApiError(http_status_1.default.UNAUTHORIZED, "You are not authorized / owner of this wishlist");
        }
    }
    // handle user validation
    if (payload.user) {
        const isExit = yield user_model_1.User.findOne({
            _id: payload.user,
            role: "user",
        });
        if (!isExit) {
            throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "User not found with this id. Please provide a valid user id");
        }
    }
    const result = yield wishlist_model_1.Wishlist.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    if (!result) {
        throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "Failed to update wishlist / Wishlist not found with this id. Please provide a valid wishlist id");
    }
    return result;
});
exports.updateSingleWishlistToDB = updateSingleWishlistToDB;
const deleteSingleWishlistFromDB = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    if (user) {
        const authorizedUser = yield wishlist_model_1.Wishlist.findOne({ _id: id, user: user._id });
        if (!authorizedUser) {
            throw new apiError_1.ApiError(http_status_1.default.UNAUTHORIZED, "You are not authorized / owner of this wishlist");
        }
    }
    const result = yield wishlist_model_1.Wishlist.findByIdAndDelete(id);
    if (!result) {
        throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "Failed to delete wishlist / Wishlist not found with this id. Please provide a valid wishlist id");
    }
    return result;
});
exports.deleteSingleWishlistFromDB = deleteSingleWishlistFromDB;
