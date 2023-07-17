import { Model, Types } from "mongoose";
import { IUser } from "../user/user.interface";
import { ICow } from "../book/book.interface";

export type IOrder = {
  cow: Types.ObjectId | ICow;
  buyer: Types.ObjectId | IUser;
};

export type OrderModel = Model<IOrder, Record<string, unknown>>;
