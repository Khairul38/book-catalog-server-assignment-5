import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createWishlistZodSchema,
  updateWishlistZodSchema,
} from "./wishlist.validation";
import {
  createWishlist,
  getAllWishlist,
  getAllWishlistByUser,
  getSingleWishlist,
  updateSingleWishlist,
  deleteSingleWishlist,
} from "./wishlist.controller";
import { auth } from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post(
  "/",
  validateRequest(createWishlistZodSchema),
  auth(ENUM_USER_ROLE.USER),
  createWishlist
);

router.get("/", auth(ENUM_USER_ROLE.ADMIN), getAllWishlist);

router.get("/user", auth(ENUM_USER_ROLE.ADMIN), getAllWishlistByUser);

router.get(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  getSingleWishlist
);

router.patch(
  "/:id",
  validateRequest(updateWishlistZodSchema),
  auth(ENUM_USER_ROLE.USER),
  updateSingleWishlist
);

router.delete("/:id", auth(ENUM_USER_ROLE.USER), deleteSingleWishlist);

export const WishlistRoutes = router;
