import { Model, Types } from "mongoose";
import { IUser } from "../user/user.interface";
import { IBook } from "../book/book.interface";

export type IWishlistStatus =
  | "Wishlisted"
  | "Reading soon"
  | "Currently reading"
  | "Finished reading";

export type IWishlist = {
  book: Types.ObjectId | IBook;
  user: Types.ObjectId | IUser;
  status: IWishlistStatus;
};

export type WishlistModel = Model<IWishlist, Record<string, unknown>>;

export type IWishlistFilters = {
  user?: string;
  searchTerm?: string;
  status?: string;
};
