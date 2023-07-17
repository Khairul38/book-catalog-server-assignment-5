import { Model } from "mongoose";

export type IUserRoles = "seller" | "buyer";

export type IUser = {
  name: {
    firstName: string;
    lastName: string;
  };
  phoneNumber: string;
  password: string;
  role: IUserRoles;
  address: string;
  budget: number;
  income: number;
};

export type UserModel = {
  isUserExist(phoneNumber: string): Promise<(IUser & { _id: string }) | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;

// export type UserModel = Model<IUser, Record<string, unknown>>;

export type IUserFilters = {
  searchTerm?: string;
};
