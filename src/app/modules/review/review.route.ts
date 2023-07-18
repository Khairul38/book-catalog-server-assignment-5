import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createReviewZodSchema } from "./review.validation";
import { createReview, getReviewsByBookId } from "./review.controller";
import { auth } from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post(
  "/:id",
  validateRequest(createReviewZodSchema),
  auth(ENUM_USER_ROLE.USER),
  createReview
);
router.get("/:id", getReviewsByBookId);

export const ReviewRoutes = router;
