"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWishlistZodSchema = exports.createWishlistZodSchema = void 0;
const zod_1 = require("zod");
const wishlist_constant_1 = require("./wishlist.constant");
exports.createWishlistZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        book: zod_1.z.string({
            required_error: "Book id is required",
        }),
        user: zod_1.z.string({
            required_error: "User id is required",
        }),
        status: zod_1.z.enum([...wishlist_constant_1.wishlistStatus], {
            required_error: "Status is required",
        }),
    }),
});
exports.updateWishlistZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        book: zod_1.z.string().optional(),
        user: zod_1.z.string().optional(),
        status: zod_1.z.enum([...wishlist_constant_1.wishlistStatus]).optional(),
    }),
});
