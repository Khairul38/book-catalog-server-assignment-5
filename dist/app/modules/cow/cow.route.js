"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const cow_validation_1 = require("./cow.validation");
const cow_controller_1 = require("./cow.controller");
const auth_1 = require("../../middlewares/auth");
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.post("/", (0, validateRequest_1.validateRequest)(cow_validation_1.createCowZodSchema), (0, auth_1.auth)(user_1.ENUM_USER_ROLE.SELLER), cow_controller_1.createCow);
router.get("/:id", (0, auth_1.auth)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.SELLER), cow_controller_1.getSingleCow);
router.patch("/:id", (0, auth_1.auth)(user_1.ENUM_USER_ROLE.SELLER), cow_controller_1.updateSingleCow);
router.delete("/:id", (0, auth_1.auth)(user_1.ENUM_USER_ROLE.SELLER), cow_controller_1.deleteSingleCow);
router.get("/", (0, auth_1.auth)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.SELLER), cow_controller_1.getAllCow);
exports.CowRoutes = router;
