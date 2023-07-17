import { Model, Types } from "mongoose";
import { IUser } from "../user/user.interface";

export type IReview = {
  userName: string;
  userEmail: string;
  message: string;
};

export type IBook = {
  title: string;
  author: string;
  genre: string;
  publicationYear: string;
  description: string;
  rating: number;
  price: number;
  reviews?: IReview[];
  postedBy: Types.ObjectId | (IUser & { _id: string });
};

export type BookModel = Model<IBook, Record<string, unknown>>;

export type IBookFilters = {
  searchTerm?: string;
  genre?: string;
  publicationYear?: string;
};
