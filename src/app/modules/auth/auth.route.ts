import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "../user/user.validation";
import { createUser, loginUser, refreshTokenUser } from "./auth.controller";
import { loginZodSchema, refreshTokenZodSchema } from "./auth.validation";

const router = express.Router();

router.post("/signup", validateRequest(createUserZodSchema), createUser);

router.post("/login", validateRequest(loginZodSchema), loginUser);

router.post(
  "/refresh-token",
  validateRequest(refreshTokenZodSchema),
  refreshTokenUser
);

export const AuthRoutes = router;
