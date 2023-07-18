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
exports.getReviewsByBookIdFromDB = exports.createReviewToDB = void 0;
const apiError_1 = require("../../../errors/apiError");
const http_status_1 = __importDefault(require("http-status"));
const book_model_1 = require("../book/book.model");
const createReviewToDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updateBook = yield book_model_1.Book.updateOne({ _id: id }, { $push: { reviews: payload } }, {
        new: true,
    });
    if (updateBook.modifiedCount === 0) {
        throw new apiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Failed to post review");
    }
    const result = yield book_model_1.Book.findById(id);
    return result;
});
exports.createReviewToDB = createReviewToDB;
const getReviewsByBookIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_model_1.Book.findOne({ _id: id }, { _id: 0, reviews: 1 });
    if (!result) {
        throw new apiError_1.ApiError(http_status_1.default.NOT_FOUND, "Review not found with this id. Please provide a valid book id");
    }
    return result.reviews;
});
exports.getReviewsByBookIdFromDB = getReviewsByBookIdFromDB;
