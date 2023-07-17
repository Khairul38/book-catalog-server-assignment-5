import { IUserRoles } from "./user.interface";

export const userRoles: IUserRoles[] = ["user", "admin"];

export const userSearchableFields = ["email", "role"];

export const userFilterableFields = ["searchTerm", "email", "role"];
