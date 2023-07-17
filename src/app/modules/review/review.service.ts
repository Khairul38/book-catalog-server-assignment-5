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

  console.log(updateBook);

  if (updateBook.modifiedCount === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to post review");
  }

  const result = await Book.findById(id);

  return result;
};
