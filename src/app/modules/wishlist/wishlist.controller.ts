import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { IWishlist } from "./wishlist.interface";
import httpStatus from "http-status";
import { pick } from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import {
  createWishlistToDB,
  deleteSingleWishlistFromDB,
  getAllWishlistByUserFromDB,
  getAllWishlistFromDB,
  getSingleWishlistFromDB,
  updateSingleWishlistToDB,
} from "./wishlist.service";
import { wishlistFilterableFields } from "./wishlist.constant";

export const createWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const { ...wishlistData } = req.body;
    const result = await createWishlistToDB(wishlistData);

    sendResponse<IWishlist>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Your book is successfully wishlisted",
      data: result,
    });
  }
);

export const getSingleWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const id = req.params.id;

    const result = await getSingleWishlistFromDB(user, id);

    sendResponse<IWishlist>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Wishlist retrieved successfully",
      data: result,
    });
  }
);

export const getAllWishlistByUser = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, wishlistFilterableFields);
    const user = req.user;

    const paginationOptions = pick(req.query, paginationFields);

    const result = await getAllWishlistByUserFromDB(
      user,
      filters,
      paginationOptions
    );

    sendResponse<IWishlist[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User all wishlist retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);
export const getAllWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, wishlistFilterableFields);
    const user = req.user;

    const paginationOptions = pick(req.query, paginationFields);

    const result = await getAllWishlistFromDB(user, filters, paginationOptions);

    sendResponse<IWishlist[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Wishlist retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const updateSingleWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const id = req.params.id;
    const updatedData = req.body;

    const result = await updateSingleWishlistToDB(user, id, updatedData);

    sendResponse<IWishlist>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Wishlist updated successfully",
      data: result,
    });
  }
);

export const deleteSingleWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const id = req.params.id;

    const result = await deleteSingleWishlistFromDB(user, id);

    sendResponse<IWishlist>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Wishlist deleted successfully",
      data: result,
    });
  }
);
