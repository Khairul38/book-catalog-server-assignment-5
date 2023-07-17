import { Schema, model } from "mongoose";
import { IWishlist, WishlistModel } from "./wishlist.interface";
import { ApiError } from "../../../errors/apiError";
import httpStatus from "http-status";

const WishlistSchema = new Schema<IWishlist, WishlistModel>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// handle duplicate entry
WishlistSchema.pre("save", async function (next) {
  const isExist = await Wishlist.findOne({ book: this.book, user: this.user });
  if (isExist) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "This book already wishlisted. Please add a new book."
    );
  }
  next();
});

export const Wishlist = model<IWishlist, WishlistModel>(
  "Wishlist",
  WishlistSchema
);
