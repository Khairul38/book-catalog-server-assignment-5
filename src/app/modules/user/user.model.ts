/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from "mongoose";
import { IUser, UserModel } from "./user.interface";
import { userRoles } from "./user.constant";
import { ApiError } from "../../../errors/apiError";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import config from "../../../config";

const UserSchema = new Schema<IUser, UserModel>(
  {
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: userRoles,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
      },
    },
  }
);

UserSchema.statics.isUserExist = async function (
  email: string
): Promise<IUser | null> {
  return await User.findOne(
    { email },
    { _id: 1, password: 1, role: 1, name: 1 }
  );
};

UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

// handle duplicate entry using same email
UserSchema.pre("save", async function (next) {
  const isExist = await User.findOne({ email: this.email });
  if (isExist) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Another user already exists with this email. Please provide a new email."
    );
  } else {
    // Hash user password
    const user = this;
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
    );
  }
  next();
});

export const User = model<IUser, UserModel>("User", UserSchema);
