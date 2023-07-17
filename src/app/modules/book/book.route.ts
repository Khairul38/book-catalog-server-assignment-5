import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookZodSchema, updateBookZodSchema } from "./book.validation";
import {
  createBook,
  deleteSingleBook,
  getAllBook,
  getSingleBook,
  updateSingleBook,
} from "./book.controller";
import { auth } from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post(
  "/",
  validateRequest(createBookZodSchema),
  auth(ENUM_USER_ROLE.USER),
  createBook
);

router.get(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  getSingleBook
);

router.patch(
  "/:id",
  validateRequest(updateBookZodSchema),
  auth(ENUM_USER_ROLE.USER),
  updateSingleBook
);

router.delete("/:id", auth(ENUM_USER_ROLE.USER), deleteSingleBook);

router.get("/", auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER), getAllBook);

export const BookRoutes = router;
