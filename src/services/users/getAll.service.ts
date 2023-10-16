import { findOperator } from './../customers/index';
import { getAll } from './index';
import { Request, Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { VOperadoresStatus } from "../../entities/voperadpres.entity";
import { OperadorStatusLog } from '../../entities/operadoresStatusLog.entity';
import { ClientCampaign } from '../../entities/clientCampaign.entity';

export async function getAllUsersService(startDate: Date, endDate: Date) {
    interface OperadorComHistoricoStatus {
        OPERADOR: number;
        NOME: string;
        STATUS_ATUAL: string;
        TEMPO: number;
        historico_status: OperadorStatusLog[];
        CODIGO_CLIENTE: number;
        PRODUTIVIDADE: number;
        LIGACOES: number;
        CONTATOS: number;
        APROVEITAMENTO: number;
        PEDIDOS: number;
    }

    const usersRepository = AppDataSource.getRepository(VOperadoresStatus);
    const historicoRepository = AppDataSource.getRepository(OperadorStatusLog);
    const codigoClienteRepository = AppDataSource.getRepository(ClientCampaign);

    const [dados] = await usersRepository.findAndCount();
    const operadoresComHistoricoStatus: OperadorComHistoricoStatus[] = [];

    const startDF = converterDataParaDiaMesAno(startDate);
    const endDF = converterDataParaDiaMesAno(endDate);

    console.log(endDF,startDF)
    for (const operador of dados) {
        let codigo_operador = operador.OPERADOR
        if(codigo_operador !== 10 && codigo_operador !== 11 && codigo_operador!== 1){
            const historico_status = await historicoRepository.query(
                "SELECT * FROM operadores_status_log WHERE OPERADOR = ? AND DATA BETWEEN ? AND ?",
                [codigo_operador, startDate, endDate]
              );
              
            const [produtividade] = await historicoRepository.query(getProdutividadeSQL(codigo_operador, startDate, endDate))
    
            let [CLIENTE] = await historicoRepository.query("SELECT CLIENTE FROM campanhas_clientes WHERE campanhas_clientes.OPERADOR = ? ORDER BY CODIGO DESC LIMIT 1; ", [codigo_operador]);
            console.log("CODIGO_CLIENTE",historico_status)
            const operadorComHistoricoStatus: OperadorComHistoricoStatus = {
                ...operador,
                historico_status: historico_status,
                CODIGO_CLIENTE: CLIENTE.CLIENTE,
                APROVEITAMENTO: produtividade.APROVEITAMENTO,
                CONTATOS: produtividade.CONTATOS,
                LIGACOES: produtividade.DISCADAS,
                PEDIDOS: produtividade.PEDIDOS,
                PRODUTIVIDADE: produtividade.PRODUTIVIDADE,
            };
    
    
    
            operadoresComHistoricoStatus.push(operadorComHistoricoStatus);
        }
     
    }

    return { dados: operadoresComHistoricoStatus }
};

function MysqlDate(date: number | Date) {
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
};
function converterDataParaDiaMesAno(dataComHoras:any) {
    const data = new Date(dataComHoras);
    const dia = data.getDate();
    const mes = data.getMonth() + 1; 
    const ano = data.getFullYear();
  
    const dataFormatada = `${ano}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;
  
    return dataFormatada;
  }
  

function getProdutividadeSQL(id: number, startDate: Date, endDate: Date) {
    return " SELECT ((SUM(XX.TEMPOEMLINHA) + COALESCE(IF('S' = 'S', SUM(XX.TEMPO_PAUSA_PROD), 0),0)) / SUM(XX.TEMPO_LOGADO)) * 100 AS PRODUTIVIDADE, SUM(XX.DISCADAS) DISCADAS, SUM(XX.CONTATOS) CONTATOS, AVG(XX.CONTATOS*100/XX.DISCADAS) APROVEITAMENTO, SUM(XX.PEDIDOS) PEDIDOS FROM (SELECT	TEMPO_LOGADO.TEMPO_LOGADO,	TEMPOEMLINHA.TEMPOEMLINHA,	RECEBIDAS.RECEBIDAS,	TEMPO_PAUSA.TEMPO_PAUSA,	TEMPO_PAUSA_PROD.TEMPO_PAUSA_PROD, "
        + " COALESCE((((COALESCE(CONV_1.TOTAL, 0) + COALESCE(CONV_2.TOTAL, 0)) * 100) /	(COALESCE(CONV_3.TOTAL, 0) + COALESCE(CONV_4.TOTAL, 0))), 0) AS CONVERSAO, CAST(COUNT(DISTINCT CC.CODIGO) AS CHAR) AS DISCADAS, CAST(SUM(IF(RES.ECONTATO='SIM',1,0)) AS CHAR) AS CONTATOS, CAST(SUM(IF(RES.ESUCESSO='SIM',1,0)) AS CHAR) AS SUCESSOS, CAST(SUM(IF(RES.EPEDIDO = 'SIM', 1, 0)) AS CHAR) AS PEDIDOS FROM 	operadores OPE LEFT JOIN  (SELECT SUM(TIME_TO_SEC(l.tempo_logado)) AS TEMPO_LOGADO, L.OPERADOR FROM  	login_ativo_receptivo l WHERE 	L.modulo = 'Ativo' "
        + " AND DATE(entrada) between '" + MysqlDate(startDate) + "' AND '" + MysqlDate(endDate)
        + "' GROUP BY 	L.OPERADOR) TEMPO_LOGADO ON TEMPO_LOGADO.OPERADOR = OPE.CODIGO LEFT JOIN ( SELECT SUM(TIME_TO_SEC(TIMEDIFF(AA.data_hora_fim, AA.data_hora_lig))) AS TEMPOEMLINHA,	AA.OPERADOR_LIGACAO FROM 	( SELECT  	data_hora_fim,  	data_hora_lig,  	OPERADOR_LIGACAO FROM  	campanhas_clientes WHERE "
        + " DATE(data_hora_lig) between '" + MysqlDate(startDate) + "' AND '" + MysqlDate(endDate)
        + "' UNION ALL SELECT cr.LIGACAO_FINALIZADA, cr.LIGACAO_RECEBIDA, cr.operador FROM chamadas_receptivo cr WHERE "
        + " DATE(cr.LIGACAO_RECEBIDA) between '" + MysqlDate(startDate) + "' AND '" + MysqlDate(endDate)
        + "' ) AA GROUP BY AA.OPERADOR_LIGACAO) TEMPOEMLINHA ON	TEMPOEMLINHA.OPERADOR_LIGACAO = OPE.CODIGO LEFT JOIN ( SELECT SUM(ligacoes_ok) AS RECEBIDAS, L.OPERADOR FROM login_ativo_receptivo l WHERE modulo = 'Receptivo' AND "
        + " DATE(entrada) between '" + MysqlDate(startDate) + "' AND '" + MysqlDate(endDate)
        + "' GROUP BY L.OPERADOR) RECEBIDAS ON	RECEBIDAS.OPERADOR = OPE.CODIGO LEFT JOIN (SELECT COUNT(1) AS TOTAL, OPERADOR_LIGACAO FROM campanhas_clientes INNER JOIN RESULTADOS R ON CAMPANHAS_CLIENTES.RESULTADO = R.CODIGO WHERE campanhas_clientes.concluido = 'SIM' AND r.Esucesso ='SIM' AND "
        + " DATE(campanhas_clientes.data_hora_lig) between '" + MysqlDate(startDate) + "' AND '" + MysqlDate(endDate)
        + "'  GROUP BY OPERADOR_LIGACAO) CONV_1 ON	CONV_1.OPERADOR_LIGACAO = OPE.CODIGO LEFT JOIN (SELECT COUNT(1) AS TOTAL,	CR.OPERADOR FROM 	chamadas_receptivo cr INNER JOIN resultados r ON	R.CODIGO = CR.RESULTADO WHERE  R.ESUCESSO = 'SIM' AND "
        + " DATE(cr.LIGACAO_RECEBIDA) between '" + MysqlDate(startDate) + "' AND '" + MysqlDate(endDate)
        + "' GROUP BY CR.OPERADOR) CONV_2 ON	CONV_2.OPERADOR = CONV_1.OPERADOR_LIGACAO LEFT JOIN (SELECT COUNT(1) AS TOTAL, OPERADOR_LIGACAO FROM campanhas_clientes INNER JOIN resultados r ON 	R.CODIGO = resultado WHERE  campanhas_clientes.concluido = 'SIM' AND r.econtato ='SIM' AND "
        + " DATE(campanhas_clientes.data_hora_lig) between '" + MysqlDate(startDate) + "' AND '" + MysqlDate(endDate)
        + "'  GROUP BY OPERADOR_LIGACAO) CONV_3 ON	CONV_3.OPERADOR_LIGACAO = OPE.CODIGO LEFT JOIN (SELECT COUNT(1) AS TOTAL, CR.OPERADOR FROM chamadas_receptivo cr INNER JOIN resultados r ON R.CODIGO = CR.RESULTADO WHERE  r.ECONTATO = 'SIM' AND "
        + " DATE(cr.LIGACAO_RECEBIDA) between '" + MysqlDate(startDate) + "' AND '" + MysqlDate(endDate)
        + "'  GROUP BY CR.OPERADOR) CONV_4 ON	CONV_4.OPERADOR = OPE.CODIGO LEFT JOIN (SELECT SUM(TIME_TO_SEC(TIMEDIFF(p.DATA_HORA_FIM, p.DATA_HORA))) AS TEMPO_PAUSA,	P.OPERADOR FROM	pausas_realizadas p INNER JOIN motivos_pausa pp ON 	pp.CODIGO = p.COD_PAUSA WHERE "
        + " DATE(p.DATA_HORA) between '" + MysqlDate(startDate) + "' AND '" + MysqlDate(endDate)
        + "' GROUP BY P.OPERADOR	) TEMPO_PAUSA ON TEMPO_PAUSA.OPERADOR = OPE.CODIGO LEFT JOIN (SELECT SUM(IF(pp.TEMPO_MAX_SEG < (TIME_TO_SEC(TIMEDIFF(p.DATA_HORA_FIM, p.DATA_HORA))), pp.TEMPO_MAX_SEG, (TIME_TO_SEC(TIMEDIFF(p.DATA_HORA_FIM, p.DATA_HORA))))) AS TEMPO_PAUSA_PROD,	P.OPERADOR FROM	pausas_realizadas p INNER JOIN motivos_pausa pp ON pp.CODIGO = p.COD_PAUSA WHERE "
        + " DATE(p.DATA_HORA) BETWEEN '" + MysqlDate(startDate) + "' AND '" + MysqlDate(endDate)
        + "' AND pp.PRODUTIVIDADE = 'SIM' GROUP BY 	P.OPERADOR) TEMPO_PAUSA_PROD ON "
        + " TEMPO_PAUSA_PROD.OPERADOR = OPE.CODIGO "
        + " INNER JOIN(SELECT COUNT(DISTINCT CAST(l.ENTRADA AS DATE)) AS DIAS_TRABALHO, L.OPERADOR "
        + " FROM login_ativo_receptivo l "
        + " WHERE l.MODULO = 'Ativo' AND DATE(l.ENTRADA) between '" + MysqlDate(startDate) + "' AND '" + MysqlDate(endDate) + "' "
        + " GROUP BY L.OPERADOR) AS DIAS_TRABALHO ON DIAS_TRABALHO.OPERADOR = OPE.CODIGO "
        + " INNER JOIN CAMPANHAS_CLIENTES CC ON CC.OPERADOR_LIGACAO = OPE.CODIGO AND date(CC.data_hora_lig) between '" + MysqlDate(startDate) + "' AND '" + MysqlDate(endDate) + "' "
        + " INNER JOIN RESULTADOS RES ON RES.CODIGO = CC.RESULTADO "
        + " INNER JOIN CAMPANHAS CAM ON CAM.CODIGO = CC.CAMPANHA "
        + " WHERE OPE.CODIGO = " + String(id) + ") XX  ";
}