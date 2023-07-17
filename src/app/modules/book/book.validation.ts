import { z } from "zod";
// import {
//   cowBreeds,
//   cowCategories,
//   cowLabels,
//   cowLocations,
// } from "./book.constant";

export const createBookZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    author: z.string({
      required_error: "Author is required",
    }),
    genre: z.string({
      required_error: "Genre is required",
    }),
    publicationYear: z.string({
      required_error: "Publication Year is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
    rating: z.number({
      required_error: "Rating is required",
    }),
    price: z.number({
      required_error: "Price is required",
    }),
    postedBy: z.string({
      required_error: "Posted by id is required",
    }),
  }),
});

export const updateBookZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    genre: z.string().optional(),
    publicationYear: z.string().optional(),
    description: z.string().optional(),
    rating: z.number().optional(),
    price: z.number().optional(),
    postedBy: z.string().optional(),
  }),
});
