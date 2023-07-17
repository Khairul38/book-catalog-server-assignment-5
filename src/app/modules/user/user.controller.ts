import httpStatus from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { pick } from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";
import { paginationFields } from "../../../constants/pagination";
import { IUser } from "./user.interface";
import { Request, Response } from "express";
import {
  deleteSingleUserFromDB,
  getAllUserFromDB,
  getProfileFromDB,
  getSingleUserFromDB,
  updateProfileToDB,
  updateSingleUserToDB,
} from "./user.service";

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await getProfileFromDB(user);

  sendResponse<IUser>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User's information retrieved successfully",
    data: result,
  });
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const updatedData = req.body;

  const result = await updateProfileToDB(user, updatedData);

  sendResponse<IUser>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully",
    data: result,
  });
});

export const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);

  const paginationOptions = pick(req.query, paginationFields);

  const result = await getAllUserFromDB(filters, paginationOptions);

  sendResponse<IUser[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await getSingleUserFromDB(id);

  sendResponse<IUser>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

export const updateSingleUser = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedData = req.body;

    const result = await updateSingleUserToDB(id, updatedData);

    sendResponse<IUser>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User updated successfully",
      data: result,
    });
  }
);

export const deleteSingleUser = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await deleteSingleUserFromDB(id);

    sendResponse<IUser>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User deleted successfully",
      data: result,
    });
  }
);
