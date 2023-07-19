import { IWishlistStatus } from "./wishlist.interface";

export const wishlistStatus: IWishlistStatus[] = [
  "Wishlisted",
  "Reading soon",
  "Currently reading",
  "Finished reading",
];

export const wishlistSearchableFields = ["title", "status"];

export const wishlistFilterableFields = ["user", "searchTerm", "status"];
