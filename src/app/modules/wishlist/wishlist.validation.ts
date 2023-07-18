import { z } from "zod";
import { wishlistStatus } from "./wishlist.constant";

export const createWishlistZodSchema = z.object({
  body: z.object({
    book: z.string({
      required_error: "Book id is required",
    }),
    user: z.string({
      required_error: "User id is required",
    }),
    status: z.enum([...wishlistStatus] as [string, ...string[]], {
      required_error: "Status is required",
    }),
  }),
});
export const updateWishlistZodSchema = z.object({
  body: z.object({
    book: z.string().optional(),
    user: z.string().optional(),
    status: z.enum([...wishlistStatus] as [string, ...string[]]).optional(),
  }),
});
