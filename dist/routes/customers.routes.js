"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRoutes = void 0;
const express_1 = require("express");
const controllers_1 = __importDefault(require("../controllers"));
const middlewares_1 = __importDefault(require("../middlewares"));
exports.customerRoutes = (0, express_1.Router)();
exports.customerRoutes.post("/customers/", controllers_1.default.customers.create);
exports.customerRoutes.get("/customers/", controllers_1.default.customers.getAllCus);
exports.customerRoutes.get("/customers/:userId", middlewares_1.default.customers.ensureParamCustomerIdExists, controllers_1.default.customers.getOneById);
exports.customerRoutes.delete("/customers/:userId", middlewares_1.default.customers.ensureParamCustomerIdExists, controllers_1.default.customers.softDelete);
exports.customerRoutes.put("/customers/:userId/recover", middlewares_1.default.customers.ensureParamCustomerIdExists, controllers_1.default.customers.recover);
exports.customerRoutes.patch("/customers/:userId", middlewares_1.default.customers.ensureParamCustomerIdExists, controllers_1.default.customers.update);
exports.customerRoutes.get("/customers/lastid", controllers_1.default.customers.getLastId);
exports.customerRoutes.get("/customers/findByOperator/:userId", middlewares_1.default.users.ensureParamUserIdExists, controllers_1.default.customers.getByOperatorId);
