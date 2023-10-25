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
exports.softDeleteCustomerService = void 0;
const customer_1 = require("../../entities/customer");
const data_source_1 = require("../../data-source");
const MotivoDesativacaoCliente_1 = require("../../entities/MotivoDesativacaoCliente");
function softDeleteCustomerService(cliente, motivo, operador) {
    return __awaiter(this, void 0, void 0, function* () {
        const TABELA_CLIENTES = data_source_1.AppDataSource.getRepository(customer_1.Customer);
        const TABELA_MOTIVOS = data_source_1.AppDataSource.getRepository(MotivoDesativacaoCliente_1.MotivoDesativacaoCliente);
        cliente.ATIVO = "NAO";
        const MOTIVO = TABELA_MOTIVOS.create({
            CLIENTE: cliente.CODIGO,
            DATAHORA: Date.now(),
            MOTIVO: motivo,
            OPERADOR: operador.CODIGO
        });
        yield TABELA_CLIENTES.save(cliente);
        yield TABELA_MOTIVOS.save(MOTIVO);
        return;
    });
}
exports.softDeleteCustomerService = softDeleteCustomerService;
;
