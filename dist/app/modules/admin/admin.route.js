"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const admin_validation_1 = require("./admin.validation");
const admin_controller_1 = require("./admin.controller");
const auth_1 = require("../../middlewares/auth");
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.post("/create-admin", (0, validateRequest_1.validateRequest)(admin_validation_1.createAdminZodSchema), admin_controller_1.createAdmin);
router.post("/login", (0, validateRequest_1.validateRequest)(admin_validation_1.loginAdminZodSchema), admin_controller_1.loginAdmin);
router.get("/my-profile", (0, auth_1.auth)(user_1.ENUM_USER_ROLE.ADMIN), admin_controller_1.getAdminProfile);
router.patch("/my-profile", (0, auth_1.auth)(user_1.ENUM_USER_ROLE.ADMIN), admin_controller_1.updateAdminProfile);
router.post("/refresh-token", (0, validateRequest_1.validateRequest)(admin_validation_1.refreshTokenAdminZodSchema), admin_controller_1.refreshTokenAdmin);
exports.AdminRoutes = router;
