"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureTokenIsValid = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../../errors");
const services_1 = __importDefault(require("../../services"));
function ensureTokenIsValid(req, res, next) {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token)
        throw new errors_1.AppError("Missing authorization token.", 400);
    jsonwebtoken_1.default.verify(token, process.env.JWT__SECRET_KEY, (error, decoded) => __awaiter(this, void 0, void 0, function* () {
        if (error)
            return new errors_1.AppError(error.message, 400);
        if (decoded && decoded.CODIGO) {
            const user = yield services_1.default.users.getOneById(Number(decoded.CODIGO));
            if (!user)
                throw new errors_1.AppError("User not found", 404);
            req.user = {
                CODIGO: Number(decoded.CODIGO),
                isAdmin: Boolean(decoded.isAdmin),
            };
            req.findUser = user;
            next();
        }
        ;
    }));
}
exports.ensureTokenIsValid = ensureTokenIsValid;
