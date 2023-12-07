"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const controllers_1 = __importDefault(require("../controllers"));
exports.userRoutes = (0, express_1.Router)();
exports.userRoutes.get("/users/", controllers_1.default.users.getAll);
exports.userRoutes.put("/users/", controllers_1.default.users.update);
exports.userRoutes.get("/users/StatusAndVendas", controllers_1.default.users.getLastId);
