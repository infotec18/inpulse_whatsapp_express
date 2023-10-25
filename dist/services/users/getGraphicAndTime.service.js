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
exports.getLastUserIdService = void 0;
const data_source_1 = require("../../data-source");
const user_entity_1 = require("../../entities/user.entity");
function getLastUserIdService(startDate, endDate) {
    return __awaiter(this, void 0, void 0, function* () {
        let VendasPorEstado;
        const historicoRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
        const startDF = converterDataParaDiaMesAno(startDate);
        const endDF = converterDataParaDiaMesAno(endDate);
        const motivos_pausa = yield historicoRepository.query("SELECT * FROM motivos_pausa");
        const sql = `
    SELECT cli.ESTADO, SUM(cc.VALOR) as VALOR
    FROM compras cc
    JOIN clientes cli on cli.CODIGO = cc.CLIENTE AND cli.ESTADO <> ''
    WHERE cc.OPERADOR > 0 AND cc.DATA BETWEEN ? AND ?
    GROUP BY cli.ESTADO
    HAVING SUM(cc.VALOR) > 0
    ORDER BY COUNT(cc.CODIGO) DESC
  `;
        const vendasPorEstado = yield historicoRepository.query(sql, [startDF, endDF]);
        if (vendasPorEstado !== null && vendasPorEstado.length > 0) {
            VendasPorEstado = vendasPorEstado;
        }
        console.log("vendas por estado", vendasPorEstado);
        return { vendasPorEstado: vendasPorEstado, motivos_pausa: motivos_pausa };
    });
}
exports.getLastUserIdService = getLastUserIdService;
;
function converterDataParaDiaMesAno(dataComHoras) {
    const data = new Date(dataComHoras);
    const dia = data.getDate();
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();
    const dataFormatada = `${ano}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;
    return dataFormatada;
}
