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
exports.updateUserService = void 0;
const data_source_1 = require("../../data-source");
const user_entity_1 = require("../../entities/user.entity");
function updateUserService(tempo) {
    return __awaiter(this, void 0, void 0, function* () {
        const usersRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
        const tempo_disponivel = yield usersRepository.query("UPDATE motivos_pausa SET TEMPO_MAX_SEG = ? WHERE DESCRICAO = 'disponível'", [tempo]);
        return tempo_disponivel;
    });
}
exports.updateUserService = updateUserService;
;
