import express from "express";
import {
  deleteSingleUser,
  getAllUser,
  getProfile,
  getSingleUser,
  updateProfile,
  updateSingleUser,
} from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateUserZodSchema } from "./user.validation";
import { auth } from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.get(
  "/my-profile",
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  getProfile
);

router.patch(
  "/my-profile",
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  updateProfile
);

router.get("/:id", auth(ENUM_USER_ROLE.ADMIN), getSingleUser);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(updateUserZodSchema),
  updateSingleUser
);

router.delete("/:id", auth(ENUM_USER_ROLE.ADMIN), deleteSingleUser);

router.get("/", auth(ENUM_USER_ROLE.ADMIN), getAllUser);

export const UserRoutes = router;
