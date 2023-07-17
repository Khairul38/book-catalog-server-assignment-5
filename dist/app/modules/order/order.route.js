"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const order_validation_1 = require("./order.validation");
const order_controller_1 = require("./order.controller");
const auth_1 = require("../../middlewares/auth");
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.post(
  "/",
  (0, validateRequest_1.validateRequest)(
    order_validation_1.createOrderZodSchema
  ),
  (0, auth_1.auth)(user_1.ENUM_USER_ROLE.BUYER),
  order_controller_1.createOrder
);
router.get(
  "/:id",
  (0, auth_1.auth)(
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.BUYER,
    user_1.ENUM_USER_ROLE.SELLER
  ),
  order_controller_1.getSingleOrder
);
router.get(
  "/",
  (0, auth_1.auth)(
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.BUYER,
    user_1.ENUM_USER_ROLE.SELLER
  ),
  order_controller_1.getAllOrder
);
exports.OrderRoutes = router;
