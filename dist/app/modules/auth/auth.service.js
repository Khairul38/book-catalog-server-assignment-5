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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenUserFromDB = exports.loginUserFromDB = exports.createUserToDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const apiError_1 = require("../../../errors/apiError");
const user_model_1 = require("../user/user.model");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const createUserToDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const createdUser = yield user_model_1.User.create(user);
    if (createdUser) {
        return createdUser;
    }
    else {
        throw new apiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Failed to create user!");
    }
});
exports.createUserToDB = createUserToDB;
const loginUserFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password } = payload;
    const isUserExist = yield user_model_1.User.isUserExist(phoneNumber);
    if (!isUserExist) {
        throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "User does not exist");
    }
    if (isUserExist.password &&
        !(yield user_model_1.User.isPasswordMatched(password, isUserExist.password))) {
        throw new apiError_1.ApiError(http_status_1.default.UNAUTHORIZED, "Password is incorrect");
    }
    //create access token & refresh token
    const { _id, role } = isUserExist;
    const accessToken = (0, jwtHelpers_1.createToken)({ _id, role, phoneNumber }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = (0, jwtHelpers_1.createToken)({ _id, role, phoneNumber }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
exports.loginUserFromDB = loginUserFromDB;
const refreshTokenUserFromDB = (token) => __awaiter(void 0, void 0, void 0, function* () {
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
    const isUserExist = yield user_model_1.User.isUserExist(phoneNumber);
    if (!isUserExist) {
        throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "User does not exist");
    }
    //generate new token
    const newAccessToken = (0, jwtHelpers_1.createToken)({
        _id: isUserExist._id,
        role: isUserExist.role,
        phoneNumber,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
exports.refreshTokenUserFromDB = refreshTokenUserFromDB;
