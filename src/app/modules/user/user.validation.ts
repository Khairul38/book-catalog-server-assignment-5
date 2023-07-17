import { z } from "zod";
import { userRoles } from "./user.constant";

export const createUserZodSchema = z.object({
  body: z.object({
    name: z.object({
      firstName: z.string({
        required_error: "First name is required",
      }),
      lastName: z.string({
        required_error: "Last name is required",
      }),
    }),
    email: z.string({
      required_error: "Email is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
    role: z
      .enum([...userRoles] as [string, ...string[]], {
        required_error: "Role is required",
      })
      .optional(),
  }),
});

export const updateUserZodSchema = z.object({
  body: z.object({
    name: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      })
      .optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    role: z.enum([...userRoles] as [string, ...string[]]).optional(),
  }),
});
