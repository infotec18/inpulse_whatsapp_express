"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastEnsureTokenIsValid = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../../errors");
function fastEnsureTokenIsValid(req, res, next) {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token)
        throw new errors_1.AppError("Missing authorization token.", 400);
    jsonwebtoken_1.default.verify(token, process.env.JWT__SECRET_KEY, (error, decoded) => {
        if (error)
            throw new errors_1.AppError(error.message, 401);
        if (decoded.CODIGO) {
            req.user = { CODIGO: Number(decoded.CODIGO), isAdmin: Boolean(decoded.isAdmin) };
        }
        ;
    });
    next();
}
exports.fastEnsureTokenIsValid = fastEnsureTokenIsValid;
