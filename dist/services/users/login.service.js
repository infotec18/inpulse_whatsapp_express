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
exports.loginUserService = void 0;
const data_source_1 = require("../../data-source");
const user_entity_1 = require("../../entities/user.entity");
const errors_1 = require("../../errors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function loginUserService(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const usersRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
        const findUser = yield usersRepository.findOneBy({ LOGIN: username });
        if (!findUser)
            throw new errors_1.AppError("Invalid login.", 404);
        if (findUser.ATIVO === "NAO")
            throw new errors_1.AppError("Inactive user.", 403);
        const isPasswordCorrect = password === findUser.SENHA;
        if (!isPasswordCorrect)
            throw new errors_1.AppError("Invalid password.", 401);
        const JWTPayload = { CODIGO: findUser.CODIGO, isAdmin: findUser.NIVEL === "ADMIN" };
        return { token: jsonwebtoken_1.default.sign(JWTPayload, process.env.JWT__SECRET_KEY, { expiresIn: process.env.JWT__EXPIRES_IN }) };
    });
}
exports.loginUserService = loginUserService;
;
