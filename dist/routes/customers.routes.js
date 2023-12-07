"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRoutes = void 0;
const express_1 = require("express");
const controllers_1 = __importDefault(require("../controllers"));
exports.customerRoutes = (0, express_1.Router)();
exports.customerRoutes.get("/customers/", controllers_1.default.customers.getAllCus);
