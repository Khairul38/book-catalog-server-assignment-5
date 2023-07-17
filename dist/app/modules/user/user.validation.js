"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("./user.constant");
exports.createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.object({
            firstName: zod_1.z.string({
                required_error: "First name is required",
            }),
            lastName: zod_1.z.string({
                required_error: "Last name is required",
            }),
        }),
        phoneNumber: zod_1.z.string({
            required_error: "Phone number is required",
        }),
        password: zod_1.z.string({
            required_error: "Password is required",
        }),
        role: zod_1.z.enum([...user_constant_1.userRoles], {
            required_error: "Role is required",
        }),
        address: zod_1.z.string({
            required_error: "Address is required",
        }),
        budget: zod_1.z.number({
            required_error: "Budget is required",
        }),
        income: zod_1.z.number({
            required_error: "Income is required",
        }),
    }),
});
exports.updateUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .object({
            firstName: zod_1.z.string().optional(),
            lastName: zod_1.z.string().optional(),
        })
            .optional(),
        phoneNumber: zod_1.z.string().optional(),
        password: zod_1.z.string().optional(),
        role: zod_1.z.enum([...user_constant_1.userRoles]).optional(),
        address: zod_1.z.string().optional(),
        budget: zod_1.z.number().optional(),
        income: zod_1.z.number().optional(),
    }),
});
