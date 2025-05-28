import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { VOperadoresStatus } from "../../entities/voperadpres.entity";
import { OperadorStatusLog } from "../../entities/operadoresStatusLog.entity";
import { In, Not } from "typeorm";

const MAGIC_NUMBERS = [12, 11, 1];

interface OperadorComHistoricoStatus {
  OPERADOR: number;
  NOME: string;
  STATUS_ATUAL: string;
  TEMPO: number;
  PRODUTIVIDADE: number;
  LIGACOES: number;
  CONTATOS: number;
  APROVEITAMENTO: number;
  PEDIDOS: number;
}

export async function getProdutividadeService(startDate: Date, endDate: Date) {
  const usersRepository = AppDataSource.getRepository(VOperadoresStatus);
  const historicoRepository = AppDataSource.getRepository(OperadorStatusLog);

    const operadores = await usersRepository.find({
    where: {
        OPERADOR: Not(In(MAGIC_NUMBERS))
    }
    });


  const operadoresIds = operadores.map(op => op.OPERADOR);

  if (operadoresIds.length === 0) {
    return { dados: [] };
  }

  const idsList = operadoresIds.join(',');

  const produtividadeRaw = await historicoRepository.query(getProdutividadeSQLBatch(idsList, startDate, endDate));

  const produtividadeMap = new Map<number, any>();
  produtividadeRaw.forEach((p: any) => {
    produtividadeMap.set(p.OPERADOR, p);
  });

  const operadoresComHistoricoStatus = operadores.map(op => {
    const prod = produtividadeMap.get(op.OPERADOR) || {};
    return {
      ...op,
      APROVEITAMENTO: prod.APROVEITAMENTO || 0,
      CONTATOS: prod.CONTATOS || 0,
      LIGACOES: prod.DISCADAS || 0,
      PEDIDOS: prod.PEDIDOS || 0,
      PRODUTIVIDADE: prod.PRODUTIVIDADE || 0,
    };
  });

  return { dados: operadoresComHistoricoStatus };
}

function MysqlDate(date: number | Date) {
  const newDate = new Date(date);
  const YYYY = newDate.getFullYear();
  const MM = String(newDate.getMonth() + 1).padStart(2, '0');
  const DD = String(newDate.getDate()).padStart(2, '0');
  const HH = String(newDate.getHours()).padStart(2, '0');
  const mm = String(newDate.getMinutes()).padStart(2, '0');
  const ss = String(newDate.getSeconds()).padStart(2, '0');

  return `${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`;
}

function getProdutividadeSQLBatch(ids: string, startDate: Date, endDate: Date) {
  const start = MysqlDate(startDate);
  const end = MysqlDate(endDate);

  return `
    SELECT 
      XX.OPERADOR,
      ((SUM(XX.TEMPOEMLINHA) + COALESCE(IF('S' = 'S', SUM(XX.TEMPO_PAUSA_PROD), 0),0)) / SUM(XX.TEMPO_LOGADO)) * 100 AS PRODUTIVIDADE, 
      SUM(XX.DISCADAS) DISCADAS, 
      SUM(XX.CONTATOS) CONTATOS, 
      AVG(XX.CONTATOS * 100 / NULLIF(XX.DISCADAS, 0)) AS APROVEITAMENTO, 
      SUM(XX.PEDIDOS) PEDIDOS 
    FROM (
      SELECT 
        OPE.CODIGO AS OPERADOR,
        COALESCE(TEMPO_LOGADO.TEMPO_LOGADO, 0) AS TEMPO_LOGADO,
        COALESCE(TEMPOEMLINHA.TEMPOEMLINHA, 0) AS TEMPOEMLINHA,
        COALESCE(TEMPO_PAUSA_PROD.TEMPO_PAUSA_PROD, 0) AS TEMPO_PAUSA_PROD,
        COUNT(DISTINCT CC.CODIGO) AS DISCADAS,
        SUM(IF(RES.ECONTATO='SIM',1,0)) AS CONTATOS,
        SUM(IF(RES.EPEDIDO = 'SIM', 1, 0)) AS PEDIDOS
      FROM operadores OPE
      LEFT JOIN (
        SELECT SUM(TIME_TO_SEC(l.tempo_logado)) AS TEMPO_LOGADO, L.OPERADOR
        FROM login_ativo_receptivo l
        WHERE l.modulo = 'Ativo' AND DATE(entrada) BETWEEN '${start}' AND '${end}'
        GROUP BY L.OPERADOR
      ) TEMPO_LOGADO ON TEMPO_LOGADO.OPERADOR = OPE.CODIGO
      LEFT JOIN (
        SELECT SUM(TIME_TO_SEC(TIMEDIFF(AA.data_hora_fim, AA.data_hora_lig))) AS TEMPOEMLINHA, AA.OPERADOR_LIGACAO
        FROM (
          SELECT data_hora_fim, data_hora_lig, OPERADOR_LIGACAO
          FROM campanhas_clientes
          WHERE DATE(data_hora_lig) BETWEEN '${start}' AND '${end}'
          UNION ALL
          SELECT cr.LIGACAO_FINALIZADA, cr.LIGACAO_RECEBIDA, cr.operador
          FROM chamadas_receptivo cr
          WHERE DATE(cr.LIGACAO_RECEBIDA) BETWEEN '${start}' AND '${end}'
        ) AA
        GROUP BY AA.OPERADOR_LIGACAO
      ) TEMPOEMLINHA ON TEMPOEMLINHA.OPERADOR_LIGACAO = OPE.CODIGO
      LEFT JOIN (
        SELECT 
          SUM(
            IF(pp.TEMPO_MAX_SEG < TIME_TO_SEC(TIMEDIFF(p.DATA_HORA_FIM, p.DATA_HORA)), 
              pp.TEMPO_MAX_SEG, 
              TIME_TO_SEC(TIMEDIFF(p.DATA_HORA_FIM, p.DATA_HORA))
            )
          ) AS TEMPO_PAUSA_PROD,
          P.OPERADOR
        FROM pausas_realizadas p
        INNER JOIN motivos_pausa pp ON pp.CODIGO = p.COD_PAUSA
        WHERE DATE(p.DATA_HORA) BETWEEN '${start}' AND '${end}' AND pp.PRODUTIVIDADE = 'SIM'
        GROUP BY P.OPERADOR
      ) TEMPO_PAUSA_PROD ON TEMPO_PAUSA_PROD.OPERADOR = OPE.CODIGO
      INNER JOIN CAMPANHAS_CLIENTES CC ON CC.OPERADOR_LIGACAO = OPE.CODIGO AND DATE(CC.data_hora_lig) BETWEEN '${start}' AND '${end}'
      INNER JOIN RESULTADOS RES ON RES.CODIGO = CC.RESULTADO
      WHERE OPE.CODIGO IN (${ids})
      GROUP BY OPE.CODIGO
    ) XX
    GROUP BY XX.OPERADOR;
  `;
}
