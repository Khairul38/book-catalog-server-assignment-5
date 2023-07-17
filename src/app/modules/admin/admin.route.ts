import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createAdminZodSchema,
  loginAdminZodSchema,
  refreshTokenAdminZodSchema,
} from "./admin.validation";
import {
  createAdmin,
  loginAdmin,
  refreshTokenAdmin,
  getAdminProfile,
  updateAdminProfile,
} from "./admin.controller";
import { auth } from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post(
  "/create-admin",
  validateRequest(createAdminZodSchema),
  createAdmin
);

router.post("/login", validateRequest(loginAdminZodSchema), loginAdmin);

router.get("/my-profile", auth(ENUM_USER_ROLE.ADMIN), getAdminProfile);

router.patch("/my-profile", auth(ENUM_USER_ROLE.ADMIN), updateAdminProfile);

router.post(
  "/refresh-token",
  validateRequest(refreshTokenAdminZodSchema),
  refreshTokenAdmin
);

export const AdminRoutes = router;
