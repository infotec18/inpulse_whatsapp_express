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
exports.findOperatorService = void 0;
const data_source_1 = require("../../data-source");
const clientCampaign_entity_1 = require("../../entities/clientCampaign.entity");
function findOperatorService(CODIGO_CLIENTE) {
    return __awaiter(this, void 0, void 0, function* () {
        const clientsCampaignRepository = data_source_1.AppDataSource.getRepository(clientCampaign_entity_1.ClientCampaign);
        const findInClientsCampaign = yield clientsCampaignRepository.findOneBy({
            CONCLUIDO: "NAO", CLIENTE: CODIGO_CLIENTE
        });
        const result = findInClientsCampaign ? findInClientsCampaign.OPERADOR : 0;
        return result;
    });
}
exports.findOperatorService = findOperatorService;
;
