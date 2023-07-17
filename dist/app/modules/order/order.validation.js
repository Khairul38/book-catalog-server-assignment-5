"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderZodSchema = void 0;
const zod_1 = require("zod");
exports.createOrderZodSchema = zod_1.z.object({
  body: zod_1.z.object({
    cow: zod_1.z.string({
      required_error: "Cow id is required",
    }),
    buyer: zod_1.z.string({
      required_error: "Buyer id is required",
    }),
  }),
});
