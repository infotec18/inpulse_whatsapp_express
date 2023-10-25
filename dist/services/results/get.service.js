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
exports.getWhatsappResultsService = void 0;
const result_entity_1 = require("../../entities/result.entity");
const data_source_1 = require("../../data-source");
function getWhatsappResultsService() {
    return __awaiter(this, void 0, void 0, function* () {
        const ResultsRepository = data_source_1.AppDataSource.getRepository(result_entity_1.Result);
        const findResults = yield ResultsRepository.findBy({
            UTILIZAR_AGENDA: "SIM"
        });
        return findResults;
    });
}
exports.getWhatsappResultsService = getWhatsappResultsService;
;
