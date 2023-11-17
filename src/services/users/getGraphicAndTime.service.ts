import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user.entity";
import { OperadorStatusLog } from '../../entities/operadoresStatusLog.entity';
import { VOperadoresStatus } from "../../entities/voperadpres.entity";

const MAGIC_NUMBERS = [10, 11, 1];

export async function getLastUserIdService( startDate: Date, endDate: Date) {
  const historicoRepository = AppDataSource.getRepository(User);
  const historicRepository = AppDataSource.getRepository(OperadorStatusLog);
  const usersRepository = AppDataSource.getRepository(VOperadoresStatus);

  const [dados] = await usersRepository.findAndCount();
  const startDF = converterDataParaDiaMesAno(startDate);
  const endDF = converterDataParaDiaMesAno(endDate);

  let operadores: any[] = [];
  let operadorL;
  for (const operador of dados) {
    let codigo_operador = operador.OPERADOR;
    if (!MAGIC_NUMBERS.includes(codigo_operador)) {
      const VALOR_VENDA = await getValorVenda(codigo_operador, startDF, endDF, historicRepository);
      const VALOR_PROPOSTA  = await getValorProposta(codigo_operador, startDF, endDF, historicRepository);

      operadorL = {
        NOME: operador.NOME,
        VALOR_PROPOSTA,
        VALOR_VENDA,
      }
    }
    if(operadorL)
    operadores.push(operadorL)
}
  const motivos_pausa = await historicoRepository.query("SELECT * FROM motivos_pausa");
  const VALOR_PROPOSTA_TOTAL  = await getValorVendaTotal( historicRepository);

  const vendasPorEstado = await getVendasPorEstado(startDF, endDF, historicoRepository);
console.log("VALOR_PROPOSTA_TOTAL",VALOR_PROPOSTA_TOTAL)
  return { vendasPorEstado, operadores, motivos_pausa,VALOR_PROPOSTA_TOTAL };
}

async function getVendasPorEstado(startDF: string, endDF: string, historicoRepository: Repository<User>) {
  const sql = `
    SELECT cli.ESTADO, SUM(cc.VALOR) as VALOR
    FROM compras cc
    JOIN clientes cli on cli.CODIGO = cc.CLIENTE AND cli.ESTADO <> ''
    WHERE cc.OPERADOR > 0 AND cc.DATA BETWEEN ? AND ?
    GROUP BY cli.ESTADO
    HAVING SUM(cc.VALOR) > 0
    ORDER BY COUNT(cc.CODIGO) DESC
  `;

  return historicoRepository.query(sql, [startDF, endDF]);
}

function converterDataParaDiaMesAno(dataComHoras: any) {
  const data = new Date(dataComHoras);
  const dia = data.getDate();
  const mes = data.getMonth() + 1;
  const ano = data.getFullYear();

  const dataFormatada = `${ano}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;

  return dataFormatada;
}
async function getValorVenda(codigo_operador: number, startDF: string, endDF: string, historicoRepository: Repository<OperadorStatusLog>) {
    const valorQuery = `
        SELECT SUM(CAST(REPLACE(cc.VALOR, ',', '') AS DECIMAL(10, 2))) AS VALOR
        FROM compras cc
        WHERE cc.OPERADOR = ? AND cc.DATA BETWEEN ? AND ?
    `;

    const valorResult = await historicoRepository.query(valorQuery, [codigo_operador, startDF, endDF]);

    return (valorResult !== null && valorResult.length > 0) ? parseFloat(valorResult[0].VALOR) : 0;
}
async function getValorVendaTotal(historicoRepository: Repository<OperadorStatusLog>) {
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
        MONTH(cc.DATA) <= MONTH(CURDATE())
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

  return await historicoRepository.query(valorQuery);
}


async function getValorProposta(codigo_operador: number, startDF: string, endDF: string, historicoRepository: Repository<OperadorStatusLog>) {
    const propostaQuery = `
        SELECT p.VALOR
        FROM campanhas_clientes a
        INNER JOIN propostas p ON p.LIGACAO = a.CODIGO
        WHERE a.OPERADOR = ? AND a.DT_RESULTADO BETWEEN ? AND ?
    `;

    const valorPropostaResult = await historicoRepository.query(propostaQuery, [codigo_operador, startDF, endDF]);

    return (valorPropostaResult !== null && valorPropostaResult.length > 0) ? parseFloat(valorPropostaResult[0].VALOR) : 0;
}

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
