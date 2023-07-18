"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Application Routes
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
// Using cors
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
// Parse data
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.get("/", (req, res) => {
    res.send("Welcome To Book Catalog Server");
});
app.use("/api/v1", routes_1.default);
// Global error handler
app.use(globalErrorHandler_1.globalErrorHandler);
// Handle not found
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: "Not Found",
        errorMessages: [
            {
                path: req.originalUrl,
                message: "API Not Found",
            },
        ],
    });
    next();
});
exports.default = app;
