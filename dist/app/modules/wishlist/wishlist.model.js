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
exports.Wishlist = void 0;
const mongoose_1 = require("mongoose");
const apiError_1 = require("../../../errors/apiError");
const http_status_1 = __importDefault(require("http-status"));
const wishlist_constant_1 = require("./wishlist.constant");
const WishlistSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: wishlist_constant_1.wishlistStatus,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// handle duplicate entry
WishlistSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const isExist = yield exports.Wishlist.findOne({ book: this.book, user: this.user });
        if (isExist) {
            throw new apiError_1.ApiError(http_status_1.default.CONFLICT, "This book already wishlisted. Please add a new book.");
        }
        next();
    });
});
exports.Wishlist = (0, mongoose_1.model)("Wishlist", WishlistSchema);
