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
exports.refreshTokenAdminFromDB = exports.updateAdminProfileToDB = exports.getAdminProfileFromDB = exports.loginAdminFromDB = exports.createAdminToDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const apiError_1 = require("../../../errors/apiError");
const admin_model_1 = require("./admin.model");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createAdminToDB = (admin) => __awaiter(void 0, void 0, void 0, function* () {
    const createdAdmin = yield admin_model_1.Admin.create(admin);
    if (createdAdmin) {
        return createdAdmin;
    }
    else {
        throw new apiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Failed to create admin!");
    }
});
exports.createAdminToDB = createAdminToDB;
const loginAdminFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password } = payload;
    const isAdminExist = yield admin_model_1.Admin.isAdminExist(phoneNumber);
    if (!isAdminExist) {
        throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "Admin does not exist");
    }
    if (isAdminExist.password &&
        !(yield admin_model_1.Admin.isPasswordMatched(password, isAdminExist.password))) {
        throw new apiError_1.ApiError(http_status_1.default.UNAUTHORIZED, "Password is incorrect");
    }
    //create access token & refresh token
    const { _id, role } = isAdminExist;
    const accessToken = (0, jwtHelpers_1.createToken)({ _id, role, phoneNumber }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = (0, jwtHelpers_1.createToken)({ _id, role, phoneNumber }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
exports.loginAdminFromDB = loginAdminFromDB;
const getAdminProfileFromDB = (admin) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_model_1.Admin.findById(admin === null || admin === void 0 ? void 0 : admin._id);
    if (result) {
        return result;
    }
    else {
        throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "Admin not found");
    }
});
exports.getAdminProfileFromDB = getAdminProfileFromDB;
const updateAdminProfileToDB = (admin, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = payload, adminData = __rest(payload, ["name"]);
    if (adminData.phoneNumber) {
        const isExist = yield admin_model_1.Admin.findOne({ phoneNumber: adminData.phoneNumber });
        if (isExist) {
            throw new apiError_1.ApiError(http_status_1.default.CONFLICT, "Another admin already exists with this phone number. Please provide a new phone number.");
        }
    }
    const updatedAdminData = Object.assign({}, adminData);
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach(key => {
            const nameKey = `name.${key}`; // `name.firstName`
            updatedAdminData[nameKey] = name[key];
        });
    }
    // hash password before update
    if (adminData.password) {
        updatedAdminData.password = yield bcrypt_1.default.hash(adminData.password, Number(config_1.default.bcrypt_salt_rounds));
    }
    const result = yield admin_model_1.Admin.findOneAndUpdate({ _id: admin === null || admin === void 0 ? void 0 : admin._id }, updatedAdminData, {
        new: true,
    });
    if (result) {
        return result;
    }
    else {
        throw new apiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Failed to update admin");
    }
});
exports.updateAdminProfileToDB = updateAdminProfileToDB;
const refreshTokenAdminFromDB = (token) => __awaiter(void 0, void 0, void 0, function* () {
    //verify token
    // invalid token - synchronous
    let verifiedToken = null;
    try {
        verifiedToken = (0, jwtHelpers_1.verifyToken)(token, config_1.default.jwt.refresh_secret);
    }
    catch (err) {
        throw new apiError_1.ApiError(http_status_1.default.FORBIDDEN, "Invalid Refresh Token");
    }
    const { phoneNumber } = verifiedToken;
    // tumi delete hye gso  kintu tumar refresh token ase
    // checking deleted user's refresh token
    const isAdminExist = yield admin_model_1.Admin.isAdminExist(phoneNumber);
    if (!isAdminExist) {
        throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "Admin does not exist");
    }
    //generate new token
    const newAccessToken = (0, jwtHelpers_1.createToken)({
        _id: isAdminExist._id,
        role: isAdminExist.role,
        phoneNumber,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
exports.refreshTokenAdminFromDB = refreshTokenAdminFromDB;
