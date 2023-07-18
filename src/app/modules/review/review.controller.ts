import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { createReviewToDB, getReviewsByBookIdFromDB } from "./review.service";
import { IBook } from "../book/book.interface";
import { IReview } from "./review.interface";

export const createReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { ...reviewData } = req.body;
  const result = await createReviewToDB(id, reviewData);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your review is successfully posted",
    data: result,
  });
});

export const getReviewsByBookId = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await getReviewsByBookIdFromDB(id);

    sendResponse<IReview[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Reviews retrieved successfully",
      data: result,
    });
  }
);
