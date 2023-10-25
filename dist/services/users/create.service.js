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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserService = void 0;
const data_source_1 = require("../../data-source");
const user_entity_1 = require("../../entities/user.entity");
function createUserService(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const usersRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
        // Desabilitado devido integração com o Inpulse
        //const hashedPassword: string = await hash(req.body.SENHA, 10);
        const hashedPassword = req.body.senha;
        const newUser = yield usersRepository.save(Object.assign(Object.assign({}, req.body), { SENHA: hashedPassword }));
        return newUser;
    });
}
exports.createUserService = createUserService;
;
