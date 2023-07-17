import { Model } from "mongoose";

type AdminName = {
  firstName: string;
  lastName: string;
};

export type IAdmin = {
  name: AdminName;
  phoneNumber: string;
  password: string;
  role: "admin";
  address: string;
};

export type ILoginAdmin = {
  phoneNumber: string;
  password: string;
};

export type ILoginAdminResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type IRefreshTokenAdminResponse = {
  accessToken: string;
};

export type AdminModel = {
  isAdminExist(phoneNumber: string): Promise<(IAdmin & { _id: string }) | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IAdmin>;

// export type AdminModel = Model<IAdmin, Record<string, unknown>>;
