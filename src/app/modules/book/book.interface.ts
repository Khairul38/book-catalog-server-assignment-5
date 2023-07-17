import { Model, Types } from "mongoose";
import { IUser } from "../user/user.interface";

// export type ICowLocations =
//   | "Dhaka"
//   | "Chattogram"
//   | "Barishal"
//   | "Rajshahi"
//   | "Sylhet"
//   | "Comilla"
//   | "Rangpur"
//   | "Mymensingh";

// export type ICowBreeds =
//   | "Brahman"
//   | "Nellore"
//   | "Sahiwal"
//   | "Gir"
//   | "Indigenous"
//   | "Tharparkar"
//   | "Kankrej";

// export type ICowLabels = "for sale" | "sold out";
// export type ICowCategories = "Dairy" | "Beef" | "Dual Purpose";

export type IBook = {
  title: string;
  author: string;
  genre: string;
  publicationYear: string;
  description: string;
  rating: number;
  price: number;
  postedBy: Types.ObjectId | (IUser & { _id: string });
};

export type BookModel = Model<IBook, Record<string, unknown>>;

export type IBookFilters = {
  searchTerm?: string;
  genre?: string;
  publicationYear?: string;
};
