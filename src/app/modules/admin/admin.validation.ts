import { z } from "zod";

export const createAdminZodSchema = z.object({
  body: z.object({
    name: z.object({
      firstName: z.string({
        required_error: "First name is required",
      }),
      lastName: z.string({
        required_error: "Last name is required",
      }),
    }),
    phoneNumber: z.string({
      required_error: "Phone number is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
    role: z.enum(["admin"] as [string, ...string[]], {
      required_error: "Role is required",
    }),
    address: z.string({
      required_error: "Address is required",
    }),
  }),
});

export const loginAdminZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: "Phone Number is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

export const refreshTokenAdminZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh Token is required",
    }),
  }),
});
