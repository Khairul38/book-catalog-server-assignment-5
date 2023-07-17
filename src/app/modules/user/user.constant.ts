import { IUserRoles } from "./user.interface";

export const userRoles: IUserRoles[] = ["seller", "buyer"];

export const userSearchableFields = ["role", "address", "phoneNumber"];

export const userFilterableFields = [
  "searchTerm",
  "role",
  "address",
  "phoneNumber",
];
