"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_validation_1 = require("../user/user.validation");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
router.post(
  "/signup",
  (0, validateRequest_1.validateRequest)(user_validation_1.createUserZodSchema),
  auth_controller_1.createUser
);
router.post(
  "/login",
  (0, validateRequest_1.validateRequest)(auth_validation_1.loginZodSchema),
  auth_controller_1.loginUser
);
router.post(
  "/refresh-token",
  (0, validateRequest_1.validateRequest)(
    auth_validation_1.refreshTokenZodSchema
  ),
  auth_controller_1.refreshTokenUser
);
exports.AuthRoutes = router;
