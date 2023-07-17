import {
  ICowBreeds,
  ICowCategories,
  ICowLabels,
  ICowLocations,
} from "./book.interface";

export const cowLocations: ICowLocations[] = [
  "Dhaka",
  "Chattogram",
  "Barishal",
  "Rajshahi",
  "Sylhet",
  "Comilla",
  "Rangpur",
  "Mymensingh",
];

export const cowBreeds: ICowBreeds[] = [
  "Brahman",
  "Nellore",
  "Sahiwal",
  "Gir",
  "Indigenous",
  "Tharparkar",
  "Kankrej",
];

export const cowLabels: ICowLabels[] = ["for sale", "sold out"];

export const cowCategories: ICowCategories[] = [
  "Dairy",
  "Beef",
  "Dual Purpose",
];

export const cowSearchableFields = ["location", "breed", "category"];

export const cowFilterableFields = [
  "searchTerm",
  "location",
  "maxPrice",
  "minPrice",
];
