"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenAdminZodSchema =
  exports.loginAdminZodSchema =
  exports.createAdminZodSchema =
    void 0;
const zod_1 = require("zod");
exports.createAdminZodSchema = zod_1.z.object({
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
    role: zod_1.z.enum(["admin"], {
      required_error: "Role is required",
    }),
    address: zod_1.z.string({
      required_error: "Address is required",
    }),
  }),
});
exports.loginAdminZodSchema = zod_1.z.object({
  body: zod_1.z.object({
    phoneNumber: zod_1.z.string({
      required_error: "Phone Number is required",
    }),
    password: zod_1.z.string({
      required_error: "Password is required",
    }),
  }),
});
exports.refreshTokenAdminZodSchema = zod_1.z.object({
  cookies: zod_1.z.object({
    refreshToken: zod_1.z.string({
      required_error: "Refresh Token is required",
    }),
  }),
});
