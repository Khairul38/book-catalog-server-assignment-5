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
exports.deleteSingleUserFromDB = exports.updateSingleUserToDB = exports.getSingleUserFromDB = exports.getAllUserFromDB = exports.updateProfileToDB = exports.getProfileFromDB = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const apiError_1 = require("../../../errors/apiError");
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const getProfileFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(user === null || user === void 0 ? void 0 : user._id);
    if (result) {
        return result;
    }
    else {
        throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "User not found");
    }
});
exports.getProfileFromDB = getProfileFromDB;
const updateProfileToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = payload, userData = __rest(payload, ["name"]);
    if (userData.email) {
        const isExist = yield user_model_1.User.findOne({ email: userData.email });
        if (isExist) {
            throw new apiError_1.ApiError(http_status_1.default.CONFLICT, "Another user already exists with this email. Please provide a new email.");
        }
    }
    const updatedUserData = Object.assign({}, userData);
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach(key => {
            const nameKey = `name.${key}`; // `name.firstName`
            updatedUserData[nameKey] = name[key];
        });
    }
    // set role
    updatedUserData.role = "user";
    // hash password before update
    if (userData.password) {
        updatedUserData.password = yield bcrypt_1.default.hash(userData.password, Number(config_1.default.bcrypt_salt_rounds));
    }
    const result = yield user_model_1.User.findOneAndUpdate({ _id: user === null || user === void 0 ? void 0 : user._id }, updatedUserData, {
        new: true,
    });
    if (result) {
        return result;
    }
    else {
        throw new apiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Failed to update user");
    }
});
exports.updateProfileToDB = updateProfileToDB;
const getAllUserFromDB = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: user_constant_1.userSearchableFields.map(field => ({
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
    const result = yield user_model_1.User.find(whereCondition)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const count = yield user_model_1.User.countDocuments();
    return {
        meta: {
            page,
            limit,
            count,
        },
        data: result,
    };
});
exports.getAllUserFromDB = getAllUserFromDB;
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    if (result) {
        return result;
    }
    else {
        throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "User not found with this id. Please provide a valid user id");
    }
});
exports.getSingleUserFromDB = getSingleUserFromDB;
const updateSingleUserToDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = payload, userData = __rest(payload, ["name"]);
    if (userData.email) {
        const isExist = yield user_model_1.User.findOne({ email: userData.email });
        if (isExist) {
            throw new apiError_1.ApiError(http_status_1.default.CONFLICT, "Another user already exists with this email. Please provide a new email.");
        }
    }
    const updatedUserData = Object.assign({}, userData);
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach(key => {
            const nameKey = `name.${key}`; // `name.firstName`
            updatedUserData[nameKey] = name[key];
        });
    }
    // hash password before update
    if (userData.password) {
        updatedUserData.password = yield bcrypt_1.default.hash(userData.password, Number(config_1.default.bcrypt_salt_rounds));
    }
    const result = yield user_model_1.User.findOneAndUpdate({ _id: id }, updatedUserData, {
        new: true,
    });
    if (result) {
        return result;
    }
    else {
        throw new apiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Failed to update user");
    }
});
exports.updateSingleUserToDB = updateSingleUserToDB;
const deleteSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndDelete(id);
    if (result) {
        return result;
    }
    else {
        throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "User not found with this id. Please provide a valid user id");
    }
});
exports.deleteSingleUserFromDB = deleteSingleUserFromDB;
