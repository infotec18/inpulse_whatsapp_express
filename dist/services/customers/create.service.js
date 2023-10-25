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
exports.createCustomerService = void 0;
const customer_1 = require("../../entities/customer");
const data_source_1 = require("../../data-source");
const __1 = __importDefault(require(".."));
const errors_1 = require("../../errors");
const origin_entity_1 = require("../../entities/origin.entity");
const clientCampaign_entity_1 = require("../../entities/clientCampaign.entity");
const whatsappParameter_1 = require("../../entities/whatsappParameter");
const attendance_entity_1 = require("../../entities/attendance.entity");
const campanha_entity_1 = require("../../entities/campanha.entity");
function createCustomerService(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const customersRepository = data_source_1.AppDataSource.getRepository(customer_1.Customer);
        const originsRepository = data_source_1.AppDataSource.getRepository(origin_entity_1.Origin);
        const CCRepository = data_source_1.AppDataSource.getRepository(clientCampaign_entity_1.ClientCampaign);
        const whatsappParametros = data_source_1.AppDataSource.getRepository(whatsappParameter_1.Wparameter);
        const attendanceRepository = data_source_1.AppDataSource.getRepository(attendance_entity_1.Attendance);
        const campanhasRepository = data_source_1.AppDataSource.getRepository(campanha_entity_1.Campanha);
        const existsCustomer = yield customersRepository.findOneBy({ CPF_CNPJ: req.body.CPF_CNPJ });
        if (!!existsCustomer)
            throw new errors_1.AppError("Este CPF/CNPJ já possuí um cadastro.", 400);
        const DATACAD = new Date();
        const lastId = yield __1.default.customers.getLastId();
        const { RAZAO, FANTASIA, CPF_CNPJ, NUMERO } = req.body;
        const NUMERO_WITHOUT_MINUS = NUMERO.replace("+", "");
        const AREA1 = NUMERO_WITHOUT_MINUS.slice(2, 4);
        const FONE1 = NUMERO_WITHOUT_MINUS.slice(4);
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
            CODIGO: lastId + 1,
            RAZAO,
            FANTASIA,
            PESSOA,
            CPF_CNPJ,
            DATACAD,
            AREA1,
            FONE1,
            DESC_FONE1: "WHATSAPP",
            ATIVO: "SIM",
            ORIGEM
        });
        if (newCustomer) {
            const UNIDADE = yield whatsappParametros.findOneBy({
                NOME: "UNIDADE_NOVO_CLIENTE"
            });
            const CAMPANHA = UNIDADE && (yield campanhasRepository.findOneBy({
                UNIDADE: Number(UNIDADE.VALOR),
                TIPO: "PROSPE"
            }));
            const newDate = new Date();
            const NOVO_CLIENTE_AGENDAMENTO = yield whatsappParametros.findOneBy({
                NOME: "AGENDAMENTO_NOVO_CLIENTE_DIAS"
            });
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
                FONE1: NUMERO_WITHOUT_MINUS
            });
        }
        ;
        return newCustomer;
    });
}
exports.createCustomerService = createCustomerService;
;
