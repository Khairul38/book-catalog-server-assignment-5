import { z } from "zod";

export const createReviewZodSchema = z.object({
  body: z.object({
    userName: z.string({
      required_error: "User name is required",
    }),
    userEmail: z.string({
      required_error: "User email is required",
    }),
    message: z.string({
      required_error: "Message is required",
    }),
  }),
});
