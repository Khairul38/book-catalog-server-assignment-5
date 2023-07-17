import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { ICow } from "./cow.interface";
import httpStatus from "http-status";
import { sendResponse } from "../../../shared/sendResponse";
import {
  createCowToDB,
  deleteSingleCowFromDB,
  getAllCowFromDB,
  getSingleCowFromDB,
  updateSingleCowToDB,
} from "./cow.service";
import { pick } from "../../../shared/pick";
import { cowFilterableFields } from "./cow.constant";
import { paginationFields } from "../../../constants/pagination";

export const createCow = catchAsync(async (req: Request, res: Response) => {
  const { ...cowData } = req.body;
  const result = await createCowToDB(cowData);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cow created successfully",
    data: result,
  });
});

export const getAllCow = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, cowFilterableFields);

  const paginationOptions = pick(req.query, paginationFields);

  const result = await getAllCowFromDB(filters, paginationOptions);

  sendResponse<ICow[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cows retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const getSingleCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await getSingleCowFromDB(id);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cow retrieved successfully",
    data: result,
  });
});

export const updateSingleCow = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const id = req.params.id;
    const updatedData = req.body;

    const result = await updateSingleCowToDB(user, id, updatedData);

    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Cow updated successfully",
      data: result,
    });
  }
);

export const deleteSingleCow = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const id = req.params.id;

    const result = await deleteSingleCowFromDB(user, id);

    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Cow deleted successfully",
      data: result,
    });
  }
);
