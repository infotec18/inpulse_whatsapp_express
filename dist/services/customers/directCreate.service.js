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
exports.directCreateCustomerService = void 0;
const customer_1 = require("../../entities/customer");
const data_source_1 = require("../../data-source");
const __1 = __importDefault(require(".."));
const origin_entity_1 = require("../../entities/origin.entity");
const whatsappParameter_1 = require("../../entities/whatsappParameter");
const campanha_entity_1 = require("../../entities/campanha.entity");
const clientCampaign_entity_1 = require("../../entities/clientCampaign.entity");
function directCreateCustomerService(params, numero) {
    return __awaiter(this, void 0, void 0, function* () {
        const customersRepository = data_source_1.AppDataSource.getRepository(customer_1.Customer);
        const originsRepository = data_source_1.AppDataSource.getRepository(origin_entity_1.Origin);
        const whatsappParametros = data_source_1.AppDataSource.getRepository(whatsappParameter_1.Wparameter);
        const campanhasRepository = data_source_1.AppDataSource.getRepository(campanha_entity_1.Campanha);
        const CCRepository = data_source_1.AppDataSource.getRepository(clientCampaign_entity_1.ClientCampaign);
        const lastId = yield __1.default.customers.getLastId();
        const DATACAD = new Date();
        const { RAZAO, CPF_CNPJ } = params;
        const PESSOA = CPF_CNPJ.length === 11 ? "FIS" : "JUR";
        const findOrigin = yield originsRepository.findOneBy({ DESCRICAO: "WHATSAPP" });
        let ORIGEM;
        if (!findOrigin) {
            const allOriginsDesc = yield originsRepository.find({
                order: {
                    CODIGO: 'DESC'
                }
            });
            const lastOriginId = allOriginsDesc[0];
            const newOrigin = yield originsRepository.save({
                CODIGO: lastOriginId.CODIGO + 1,
                DESCRICAO: "WHATSAPP"
            });
            ORIGEM = newOrigin.CODIGO;
        }
        else {
            ORIGEM = findOrigin.CODIGO;
        }
        ;
        const newCustomer = yield customersRepository.save({
            CODIGO: lastId ? lastId + 1 : 1,
            RAZAO: RAZAO,
            PESSOA: PESSOA,
            CPF_CNPJ: CPF_CNPJ,
            DATACAD,
            DESC_FONE1: "WHATSAPP",
            ATIVO: "SIM",
            ORIGEM,
            COD_ERP: null
        });
        if (newCustomer) {
            const UNIDADE = yield whatsappParametros.findOneBy({
                NOME: "UNIDADE_NOVO_CLIENTE"
            });
            const CAMPANHA = UNIDADE && (yield campanhasRepository.findOneBy({
                UNIDADE: Number(UNIDADE.VALOR),
                TIPO: "PROSPE"
            }));
            const NOVO_CLIENTE_AGENDAMENTO = yield whatsappParametros.findOneBy({
                NOME: "AGENDAMENTO_NOVO_CLIENTE_DIAS"
            });
            const newDate = new Date();
            if (NOVO_CLIENTE_AGENDAMENTO) {
                newDate.setDate(newDate.getDate() + Number(NOVO_CLIENTE_AGENDAMENTO));
            }
            else {
                newDate.setDate(newDate.getDate() + 3);
            }
            ;
            yield CCRepository.save({
                CAMPANHA: (CAMPANHA === null || CAMPANHA === void 0 ? void 0 : CAMPANHA.CODIGO) || 4,
                CLIENTE: newCustomer.CODIGO,
                CONCLUIDO: "NAO",
                DT_AGENDAMENTO: newDate,
                OPERADOR: 0,
                FONE1: numero
            });
        }
        ;
        return newCustomer;
    });
}
exports.directCreateCustomerService = directCreateCustomerService;
;
