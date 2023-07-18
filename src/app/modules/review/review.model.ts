import { Schema, model } from "mongoose";
import { IReview, ReviewModel } from "./review.interface";

export const ReviewSchema = new Schema<IReview, ReviewModel>(
  {
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Review = model<IReview, ReviewModel>("Review", ReviewSchema);
