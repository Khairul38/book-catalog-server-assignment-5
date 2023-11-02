"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const book_validation_1 = require("./book.validation");
const book_controller_1 = require("./book.controller");
const auth_1 = require("../../middlewares/auth");
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.post("/", (0, validateRequest_1.validateRequest)(book_validation_1.createBookZodSchema), (0, auth_1.auth)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.USER), book_controller_1.createBook);
router.get("/:id", book_controller_1.getSingleBook);
router.patch("/:id", (0, validateRequest_1.validateRequest)(book_validation_1.updateBookZodSchema), (0, auth_1.auth)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.USER), book_controller_1.updateSingleBook);
router.delete("/:id", (0, auth_1.auth)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.USER), book_controller_1.deleteSingleBook);
router.get("/", book_controller_1.getAllBook);
exports.BookRoutes = router;
