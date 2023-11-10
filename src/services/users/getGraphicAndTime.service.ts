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
    console.log(operadorL)
    if(operadorL !== null)
    operadores.push(operadorL)
}
  const motivos_pausa = await historicoRepository.query("SELECT * FROM motivos_pausa");

  const vendasPorEstado = await getVendasPorEstado(startDF, endDF, historicoRepository);

console.log(vendasPorEstado,)
  return { vendasPorEstado, operadores, motivos_pausa, };
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
        SELECT SUM(cc.VALOR) as VALOR
        FROM compras cc
        WHERE cc.OPERADOR = ? AND cc.DATA BETWEEN ? AND ?
    `;

    const valorResult = await historicoRepository.query(valorQuery, [codigo_operador, startDF, endDF]);

    return (valorResult !== null && valorResult.length > 0) ? parseFloat(valorResult[0].VALOR) : 0;
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
