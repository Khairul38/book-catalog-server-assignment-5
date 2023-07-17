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

router.get("/my-profile", auth(ENUM_USER_ROLE.USER), getProfile);

router.patch(
  "/my-profile",
  validateRequest(updateUserZodSchema),
  auth(ENUM_USER_ROLE.USER),
  updateProfile
);

router.get("/:id", auth(ENUM_USER_ROLE.ADMIN), getSingleUser);

router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  updateSingleUser
);

router.delete("/:id", auth(ENUM_USER_ROLE.ADMIN), deleteSingleUser);

router.get("/", auth(ENUM_USER_ROLE.ADMIN), getAllUser);

export const UserRoutes = router;
