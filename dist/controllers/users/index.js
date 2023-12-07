"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastId = exports.update = exports.getAll = void 0;
const getAll_controller_1 = require("./getAll.controller");
const getLastId_controller_1 = require("./getLastId.controller");
const update_controller_1 = require("./update.controller");
exports.getAll = getAll_controller_1.getAllUsersController;
exports.update = update_controller_1.updateUserController;
exports.getLastId = getLastId_controller_1.getLastUserIdController;
