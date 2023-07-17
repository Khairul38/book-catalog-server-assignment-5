import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { IOrder } from "./order.interface";
import httpStatus from "http-status";
import { pick } from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import {
  createOrderToDB,
  getAllOrderFromDB,
  getSingleOrderFromDB,
} from "./order.service";

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { ...orderData } = req.body;
  const result = await createOrderToDB(orderData);

  sendResponse<IOrder>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your cow purchase is successfully made",
    data: result,
  });
});

export const getSingleOrder = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const id = req.params.id;

    const result = await getSingleOrderFromDB(user, id);

    sendResponse<IOrder>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order retrieved successfully",
      data: result,
    });
  }
);

export const getAllOrder = catchAsync(async (req: Request, res: Response) => {
  // const filters = pick(req.query, academicSemesterFilterableFields);
  const user = req.user;

  const paginationOptions = pick(req.query, paginationFields);

  const result = await getAllOrderFromDB(
    // filters,
    user,
    paginationOptions
  );

  sendResponse<IOrder[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});
