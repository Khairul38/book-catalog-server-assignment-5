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
exports.deleteSingleCowFromDB = exports.updateSingleCowToDB = exports.getSingleCowFromDB = exports.getAllCowFromDB = exports.createCowToDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const apiError_1 = require("../../../errors/apiError");
const cow_model_1 = require("./cow.model");
const user_model_1 = require("../user/user.model");
const cow_constant_1 = require("./cow.constant");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createCowToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // handle seller validation
    const isExit = yield user_model_1.User.findOne({
        _id: payload.seller,
        role: "seller",
    });
    if (!isExit) {
        throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "Seller not found with this id. Please provide a valid seller id");
    }
    if (!payload.label) {
        payload.label = "for sale";
    }
    const result = yield cow_model_1.Cow.create(payload);
    return result;
});
exports.createCowToDB = createCowToDB;
const getAllCowFromDB = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: cow_constant_1.cowSearchableFields.map(field => ({
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
                }
                else if (field === "maxPrice") {
                    return { price: { $lte: Number(value) } };
                }
                else {
                    return { [field]: value };
                }
            }),
        });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereCondition = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield cow_model_1.Cow.find(whereCondition)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const count = yield cow_model_1.Cow.countDocuments();
    return {
        meta: {
            page,
            limit,
            count,
        },
        data: result,
    };
});
exports.getAllCowFromDB = getAllCowFromDB;
const getSingleCowFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.Cow.findById(id);
    if (!result) {
        throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "Cow not found with this id. Please provide a valid cow id");
    }
    return result;
});
exports.getSingleCowFromDB = getSingleCowFromDB;
const updateSingleCowToDB = (user, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // handle seller authorization
    if (user) {
        const authorizedSeller = yield cow_model_1.Cow.findOne({ _id: id, seller: user._id });
        if (!authorizedSeller) {
            throw new apiError_1.ApiError(http_status_1.default.UNAUTHORIZED, "You are not authorized / owner of the cow");
        }
    }
    // handle seller validation
    if (payload.seller) {
        const isExit = yield user_model_1.User.findOne({
            _id: payload.seller,
            role: "seller",
        });
        if (!isExit) {
            throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "Seller not found with this id. Please provide a valid seller id");
        }
    }
    const result = yield cow_model_1.Cow.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    if (!result) {
        throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "Cow not found with this id. Please provide a valid cow id");
    }
    return result;
});
exports.updateSingleCowToDB = updateSingleCowToDB;
const deleteSingleCowFromDB = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    if (user) {
        const authorizedSeller = yield cow_model_1.Cow.findOne({ _id: id, seller: user._id });
        if (!authorizedSeller) {
            throw new apiError_1.ApiError(http_status_1.default.UNAUTHORIZED, "You are not authorized / owner of the cow");
        }
    }
    const result = yield cow_model_1.Cow.findByIdAndDelete(id);
    if (!result) {
        throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "Cow not found with this id. Please provide a valid cow id");
    }
    return result;
});
exports.deleteSingleCowFromDB = deleteSingleCowFromDB;
