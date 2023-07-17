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
    phoneNumber: z.string({
      required_error: "Phone number is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
    role: z.enum([...userRoles] as [string, ...string[]], {
      required_error: "Role is required",
    }),
    address: z.string({
      required_error: "Address is required",
    }),
    budget: z.number({
      required_error: "Budget is required",
    }),
    income: z.number({
      required_error: "Income is required",
    }),
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
    phoneNumber: z.string().optional(),
    password: z.string().optional(),
    role: z.enum([...userRoles] as [string, ...string[]]).optional(),
    address: z.string().optional(),
    budget: z.number().optional(),
    income: z.number().optional(),
  }),
});
