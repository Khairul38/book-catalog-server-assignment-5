"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const user_route_1 = require("../modules/user/user.route");
const book_route_1 = require("../modules/book/book.route");
const wishlist_route_1 = require("../modules/wishlist/wishlist.route");
const admin_route_1 = require("../modules/admin/admin.route");
const review_route_1 = require("../modules/review/review.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/users",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/books",
        route: book_route_1.BookRoutes,
    },
    {
        path: "/wishlist",
        route: wishlist_route_1.WishlistRoutes,
    },
    {
        path: "/reviews",
        route: review_route_1.ReviewRoutes,
    },
    {
        path: "/admins",
        route: admin_route_1.AdminRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
