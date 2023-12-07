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
const operadoresStatusLog_entity_1 = require("../../entities/operadoresStatusLog.entity");
const voperadpres_entity_1 = require("../../entities/voperadpres.entity");
const MAGIC_NUMBERS = [10, 11, 1];
function getLastUserIdService(startDate, endDate) {
    return __awaiter(this, void 0, void 0, function* () {
        const historicoRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
        const historicRepository = data_source_1.AppDataSource.getRepository(operadoresStatusLog_entity_1.OperadorStatusLog);
        const usersRepository = data_source_1.AppDataSource.getRepository(voperadpres_entity_1.VOperadoresStatus);
        const [dados] = yield usersRepository.findAndCount();
        const startDF = converterDataParaDiaMesAno(startDate);
        const endDF = converterDataParaDiaMesAno(endDate);
        let operadores = [];
        let operadorL;
        for (const operador of dados) {
            let codigo_operador = operador.OPERADOR;
            if (!MAGIC_NUMBERS.includes(codigo_operador)) {
                const VALOR_VENDA = yield getValorVenda(codigo_operador, startDF, endDF, historicRepository);
                const VALOR_PROPOSTA = yield getValorProposta(codigo_operador, startDF, endDF, historicRepository);
                if (!VALOR_VENDA)
                    continue;
                operadorL = {
                    NOME: operador.NOME,
                    VALOR_PROPOSTA,
                    VALOR_VENDA,
                };
                if (operadorL)
                    operadores.push(operadorL);
            }
        }
        const motivos_pausa = yield historicoRepository.query("SELECT * FROM motivos_pausa");
        const VALOR_PROPOSTA_TOTAL = yield getValorVendaTotal(historicRepository);
        const vendasPorEstado = yield getVendasPorEstado(startDF, endDF, historicoRepository);
        return { vendasPorEstado, operadores, motivos_pausa, VALOR_PROPOSTA_TOTAL };
    });
}
exports.getLastUserIdService = getLastUserIdService;
function getVendasPorEstado(startDF, endDF, historicoRepository) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `
    SELECT cli.ESTADO, SUM(cc.VALOR) as VALOR
    FROM compras cc
    JOIN clientes cli on cli.CODIGO = cc.CLIENTE
    WHERE cc.OPERADOR IS NULL AND cc.DATA BETWEEN ? AND ? 
    GROUP BY cli.ESTADO
    HAVING SUM(cc.VALOR) > 0
    ORDER BY COUNT(cc.CODIGO) DESC
  `;
        return historicoRepository.query(sql, [startDF, endDF]);
    });
}
function converterDataParaDiaMesAno(dataComHoras) {
    const data = new Date(dataComHoras);
    const dia = data.getDate();
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();
    const dataFormatada = `${ano}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;
    return dataFormatada;
}
function getValorVenda(codigo_operador, startDF, endDF, historicoRepository) {
    return __awaiter(this, void 0, void 0, function* () {
        const valorQuery = `
        SELECT SUM(CAST(REPLACE(cc.VALOR, ',', '') AS DECIMAL(10, 2))) AS VALOR
        FROM compras cc
        WHERE cc.OPERADOR = ? AND cc.DATA BETWEEN ? AND ?
    `;
        const valorResult = yield historicoRepository.query(valorQuery, [codigo_operador, startDF, endDF]);
        return (valorResult !== null && valorResult.length > 0) ? parseFloat(valorResult[0].VALOR) : 0;
    });
}
function getValorVendaTotal(historicoRepository) {
    return __awaiter(this, void 0, void 0, function* () {
        const valorQuery = `
      SELECT
        CASE 
        WHEN MONTH(cc.DATA) = 1 THEN 'Jan'
        WHEN MONTH(cc.DATA) = 2 THEN 'Fev'
        WHEN MONTH(cc.DATA) = 3 THEN 'Mar'
        WHEN MONTH(cc.DATA) = 4 THEN 'Abr'
        WHEN MONTH(cc.DATA) = 5 THEN 'Mai'
        WHEN MONTH(cc.DATA) = 6 THEN 'Jun'
        WHEN MONTH(cc.DATA) = 7 THEN 'Jul'
        WHEN MONTH(cc.DATA) = 8 THEN 'Ago'
        WHEN MONTH(cc.DATA) = 9 THEN 'Set'
        WHEN MONTH(cc.DATA) = 10 THEN 'Out'
        WHEN MONTH(cc.DATA) = 11 THEN 'Nov'
        WHEN MONTH(cc.DATA) = 12 THEN 'Dez'
          END AS Mes,
        SUM(CAST(REPLACE(cc.VALOR, ',', '') AS DECIMAL(10, 2))) AS VendaTotal
      FROM
        compras cc
      WHERE
        YEAR(cc.DATA) = YEAR(CURDATE()) AND
        MONTH(cc.DATA) <= MONTH(CURDATE()) AND
        cc.OPERADOR IS NULL
      GROUP BY
        Mes
        ORDER BY
        CASE 
            WHEN MONTH(cc.DATA) = 1 THEN 1
            WHEN MONTH(cc.DATA) = 2 THEN 2
            WHEN MONTH(cc.DATA) = 3 THEN 3
            WHEN MONTH(cc.DATA) = 4 THEN 4
            WHEN MONTH(cc.DATA) = 5 THEN 5
            WHEN MONTH(cc.DATA) = 6 THEN 6
            WHEN MONTH(cc.DATA) = 7 THEN 7
            WHEN MONTH(cc.DATA) = 8 THEN 8
            WHEN MONTH(cc.DATA) = 9 THEN 9
            WHEN MONTH(cc.DATA) = 10 THEN 10
            WHEN MONTH(cc.DATA) = 11 THEN 11
            WHEN MONTH(cc.DATA) = 12 THEN 12
        END DESC;
  `;
        return yield historicoRepository.query(valorQuery);
    });
}
function getValorProposta(codigo_operador, startDF, endDF, historicoRepository) {
    return __awaiter(this, void 0, void 0, function* () {
        const propostaQuery = `
        SELECT p.VALOR
        FROM campanhas_clientes a
        INNER JOIN propostas p ON p.LIGACAO = a.CODIGO
        WHERE a.OPERADOR = ? AND a.DT_RESULTADO BETWEEN ? AND ?
    `;
        const valorPropostaResult = yield historicoRepository.query(propostaQuery, [codigo_operador, startDF, endDF]);
        return (valorPropostaResult !== null && valorPropostaResult.length > 0) ? parseFloat(valorPropostaResult[0].VALOR) : 0;
    });
}
function MysqlDate(date) {
    const newDate = new Date(date);
    const YYYY = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();
    const hour = newDate.getHours();
    const minutes = newDate.getMinutes();
    const seconds = newDate.getSeconds();
    const MM = month >= 10 ? month : `0${month}`;
    const DD = day >= 10 ? day : `0${day}`;
    const HH = hour >= 10 ? hour : `0${hour}`;
    const mm = minutes >= 10 ? minutes : `0${minutes}`;
    const ss = seconds >= 10 ? seconds : `0${seconds}`;
    const mysqlDateString = `${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`;
    return mysqlDateString;
}
;
