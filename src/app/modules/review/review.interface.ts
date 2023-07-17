import { Model } from "mongoose";

export type IReview = {
  userName: string;
  userEmail: string;
  message: string;
};

export type ReviewModel = Model<IReview, Record<string, unknown>>;
