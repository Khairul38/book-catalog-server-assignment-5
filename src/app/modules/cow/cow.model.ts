import { Schema, model } from "mongoose";
import { CowModel, ICow } from "./cow.interface";
import {
  cowBreeds,
  cowCategories,
  cowLabels,
  cowLocations,
} from "./cow.constant";

const cowSchema = new Schema<ICow, CowModel>(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
      enum: cowLocations,
    },
    breed: {
      type: String,
      required: true,
      enum: cowBreeds,
    },
    weight: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      enum: cowLabels,
    },
    category: {
      type: String,
      required: true,
      enum: cowCategories,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

export const Cow = model<ICow, CowModel>("Cow", cowSchema);
