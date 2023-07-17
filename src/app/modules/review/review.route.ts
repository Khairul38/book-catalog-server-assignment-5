import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createReviewZodSchema } from "./review.validation";
import { createReview } from "./review.controller";
import { auth } from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post(
  "/:id",
  validateRequest(createReviewZodSchema),
  auth(ENUM_USER_ROLE.USER),
  createReview
);

export const ReviewRoutes = router;
