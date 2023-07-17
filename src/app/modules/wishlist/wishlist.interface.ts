import { Model, Types } from "mongoose";
import { IUser } from "../user/user.interface";
import { IBook } from "../book/book.interface";

export type IWishlist = {
  book: Types.ObjectId | IBook;
  user: Types.ObjectId | IUser;
  status: string;
};

export type WishlistModel = Model<IWishlist, Record<string, unknown>>;

export type IWishlistFilters = {
  searchTerm?: string;
  status?: string;
};
