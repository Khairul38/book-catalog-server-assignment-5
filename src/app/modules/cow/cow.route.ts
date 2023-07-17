import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCowZodSchema } from "./cow.validation";
import {
  createCow,
  deleteSingleCow,
  getAllCow,
  getSingleCow,
  updateSingleCow,
} from "./cow.controller";
import { auth } from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post(
  "/",
  validateRequest(createCowZodSchema),
  auth(ENUM_USER_ROLE.SELLER),
  createCow
);

router.get(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  getSingleCow
);

router.patch("/:id", auth(ENUM_USER_ROLE.SELLER), updateSingleCow);

router.delete("/:id", auth(ENUM_USER_ROLE.SELLER), deleteSingleCow);

router.get(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  getAllCow
);

export const CowRoutes = router;
