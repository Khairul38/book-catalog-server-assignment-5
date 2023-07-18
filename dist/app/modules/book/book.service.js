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
exports.deleteSingleBookFromDB = exports.updateSingleBookToDB = exports.getSingleBookFromDB = exports.getAllBookFromDB = exports.createBookToDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const apiError_1 = require("../../../errors/apiError");
const book_model_1 = require("./book.model");
const user_model_1 = require("../user/user.model");
const book_constant_1 = require("./book.constant");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createBookToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // set postedBy
    payload.postedBy = user === null || user === void 0 ? void 0 : user._id;
    const result = yield book_model_1.Book.create(payload);
    return result;
});
exports.createBookToDB = createBookToDB;
const getAllBookFromDB = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: book_constant_1.bookSearchableFields.map(field => ({
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
    const result = yield book_model_1.Book.find(whereCondition)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const count = yield book_model_1.Book.countDocuments(whereCondition);
    return {
        meta: {
            page,
            limit,
            count,
        },
        data: result,
    };
});
exports.getAllBookFromDB = getAllBookFromDB;
const getSingleBookFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_model_1.Book.findById(id);
    if (!result) {
        throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "Book not found with this id. Please provide a valid book id");
    }
    return result;
});
exports.getSingleBookFromDB = getSingleBookFromDB;
const updateSingleBookToDB = (user, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // handle user authorization
    if (user) {
        const authorizedUser = yield book_model_1.Book.findOne({ _id: id, postedBy: user._id });
        if (!authorizedUser) {
            throw new apiError_1.ApiError(http_status_1.default.UNAUTHORIZED, "You are not authorized / owner of this book");
        }
    }
    // handle user validation
    if (payload.postedBy) {
        const isExit = yield user_model_1.User.findOne({
            _id: payload.postedBy,
            role: "user",
        });
        if (!isExit) {
            throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "User not found with this postedBy id. Please provide a valid user id");
        }
    }
    const result = yield book_model_1.Book.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    if (!result) {
        throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "Failed to update book / Book not found with this id. Please provide a valid book id");
    }
    return result;
});
exports.updateSingleBookToDB = updateSingleBookToDB;
const deleteSingleBookFromDB = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    if (user) {
        const authorizedUser = yield book_model_1.Book.findOne({ _id: id, postedBy: user._id });
        if (!authorizedUser) {
            throw new apiError_1.ApiError(http_status_1.default.UNAUTHORIZED, "You are not authorized / owner of this book");
        }
    }
    const result = yield book_model_1.Book.findByIdAndDelete(id);
    if (!result) {
        throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "Failed to delete book / Book not found with this id. Please provide a valid book id");
    }
    return result;
});
exports.deleteSingleBookFromDB = deleteSingleBookFromDB;
