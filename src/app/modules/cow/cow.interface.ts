import { Model, Types } from "mongoose";
import { IUser } from "../user/user.interface";

export type ICowLocations =
  | "Dhaka"
  | "Chattogram"
  | "Barishal"
  | "Rajshahi"
  | "Sylhet"
  | "Comilla"
  | "Rangpur"
  | "Mymensingh";

export type ICowBreeds =
  | "Brahman"
  | "Nellore"
  | "Sahiwal"
  | "Gir"
  | "Indigenous"
  | "Tharparkar"
  | "Kankrej";

export type ICowLabels = "for sale" | "sold out";
export type ICowCategories = "Dairy" | "Beef" | "Dual Purpose";

export type ICow = {
  name: string;
  age: number;
  price: number;
  location: ICowLocations;
  breed: ICowBreeds;
  weight: number;
  label: ICowLabels;
  category: ICowCategories;
  seller: Types.ObjectId | (IUser & { _id: string });
};

export type CowModel = Model<ICow, Record<string, unknown>>;

export type ICowFilters = {
  searchTerm?: string;
  location?: string;
  maxPrice?: string;
  minPrice?: string;
};
