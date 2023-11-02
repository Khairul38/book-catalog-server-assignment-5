"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const review_validation_1 = require("./review.validation");
const review_controller_1 = require("./review.controller");
const auth_1 = require("../../middlewares/auth");
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.post("/:id", (0, validateRequest_1.validateRequest)(review_validation_1.createReviewZodSchema), (0, auth_1.auth)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.USER), review_controller_1.createReview);
router.get("/:id", review_controller_1.getReviewsByBookId);
exports.ReviewRoutes = router;
