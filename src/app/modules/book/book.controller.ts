import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { IBook } from "./book.interface";
import httpStatus from "http-status";
import { sendResponse } from "../../../shared/sendResponse";
import {
  createBookToDB,
  deleteSingleBookFromDB,
  getAllBookFromDB,
  getSingleBookFromDB,
  updateSingleBookToDB,
} from "./book.service";
import { pick } from "../../../shared/pick";
import { bookFilterableFields } from "./book.constant";
import { paginationFields } from "../../../constants/pagination";

export const createBook = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { ...bookData } = req.body;
  const result = await createBookToDB(user, bookData);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book created successfully",
    data: result,
  });
});

export const getAllBook = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bookFilterableFields);

  const paginationOptions = pick(req.query, paginationFields);

  const result = await getAllBookFromDB(filters, paginationOptions);

  sendResponse<IBook[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Books retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await getSingleBookFromDB(id);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book retrieved successfully",
    data: result,
  });
});

export const updateSingleBook = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const id = req.params.id;
    const updatedData = req.body;

    const result = await updateSingleBookToDB(user, id, updatedData);

    sendResponse<IBook>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Book updated successfully",
      data: result,
    });
  }
);

export const deleteSingleBook = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const id = req.params.id;

    const result = await deleteSingleBookFromDB(user, id);

    sendResponse<IBook>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Book deleted successfully",
      data: result,
    });
  }
);
