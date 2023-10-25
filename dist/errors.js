"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.ReqError = exports.AppError = void 0;
const fs_1 = require("fs");
const zod_1 = require("zod");
const path_1 = __importDefault(require("path"));
class AppError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
    ;
}
exports.AppError = AppError;
;
class ReqError extends Error {
    constructor(req) {
        super();
        this.req = req;
    }
    ;
}
exports.ReqError = ReqError;
;
function errorHandler(error, req, res, _) {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
    }
    ;
    if (error instanceof zod_1.ZodError) {
        return res.status(400).json({ message: error.flatten().fieldErrors });
    }
    ;
    if (error instanceof ReqError) {
        const date = new Date().toUTCString();
        const filePath = path_1.default.join(__dirname, `../../../localFiles/errors`, `${date}_error.txt`);
        (0, fs_1.writeFile)(filePath, JSON.stringify(error.req), (err) => {
        });
    }
    console.error(error);
    return res
        .status(500)
        .json({ message: error.message });
}
exports.errorHandler = errorHandler;
;
