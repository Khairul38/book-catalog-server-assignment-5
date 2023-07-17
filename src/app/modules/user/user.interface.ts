import { Model } from "mongoose";

export type IUserRoles = "user" | "admin";

export type IUser = {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  password: string;
  role: IUserRoles;
};

export type UserModel = {
  isUserExist(email: string): Promise<(IUser & { _id: string }) | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;

// export type UserModel = Model<IUser, Record<string, unknown>>;

export type IUserFilters = {
  searchTerm?: string;
  email?: string;
  role?: string;
};
