"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookZodSchema = exports.createBookZodSchema = void 0;
const zod_1 = require("zod");
exports.createBookZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: "Title is required",
        }),
        author: zod_1.z.string({
            required_error: "Author is required",
        }),
        genre: zod_1.z.string({
            required_error: "Genre is required",
        }),
        publicationYear: zod_1.z.string({
            required_error: "Publication Year is required",
        }),
        description: zod_1.z.string({
            required_error: "Description is required",
        }),
        image: zod_1.z.string({
            required_error: "Image is required",
        }),
        rating: zod_1.z.number({
            required_error: "Rating is required",
        }),
        price: zod_1.z.number({
            required_error: "Price is required",
        }),
        postedBy: zod_1.z
            .string({
            required_error: "Posted by id is required",
        })
            .optional(),
    }),
});
exports.updateBookZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        author: zod_1.z.string().optional(),
        genre: zod_1.z.string().optional(),
        publicationYear: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
        rating: zod_1.z.number().optional(),
        price: zod_1.z.number().optional(),
        postedBy: zod_1.z.string().optional(),
    }),
});
