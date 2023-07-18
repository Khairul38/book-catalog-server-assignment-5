import { Schema, model } from "mongoose";
import { BookModel, IBook } from "./book.interface";
import { ReviewSchema } from "../review/review.model";

const BookSchema = new Schema<IBook, BookModel>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    publicationYear: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviews: {
      type: [ReviewSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Book = model<IBook, BookModel>("Book", BookSchema);
