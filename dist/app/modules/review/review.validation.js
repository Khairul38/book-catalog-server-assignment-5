"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewZodSchema = void 0;
const zod_1 = require("zod");
exports.createReviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        userName: zod_1.z.string({
            required_error: "User name is required",
        }),
        userEmail: zod_1.z.string({
            required_error: "User email is required",
        }),
        message: zod_1.z.string({
            required_error: "Message is required",
        }),
    }),
});
