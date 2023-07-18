import { IReview } from "./review.interface";
import { ApiError } from "../../../errors/apiError";
import httpStatus from "http-status";
import { Book } from "../book/book.model";
import { IBook } from "../book/book.interface";

export const createReviewToDB = async (
  id: string,
  payload: IReview
): Promise<IBook | null> => {
  const updateBook = await Book.updateOne(
    { _id: id },
    { $push: { reviews: payload } },
    {
      new: true,
    }
  );

  if (updateBook.modifiedCount === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to post review");
  }

  const result = await Book.findById(id);

  return result;
};

export const getReviewsByBookIdFromDB = async (
  id: string
): Promise<IReview[] | undefined> => {
  const result = await Book.findOne({ _id: id }, { _id: 0, reviews: 1 });

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Review not found with this id. Please provide a valid book id"
    );
  }
  return result.reviews;
};
