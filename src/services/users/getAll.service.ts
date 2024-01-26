import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { VOperadoresStatus } from "../../entities/voperadpres.entity";
import { OperadorStatusLog } from '../../entities/operadoresStatusLog.entity';

const MAGIC_NUMBERS = [10, 11, 1];

interface OperadorComHistoricoStatus {
    OPERADOR: number;
    NOME: string;
    STATUS_ATUAL: string;
    TEMPO: number;
    CODIGO_CLIENTE: number;
    VALOR_PROPOSTA: number;
    VALOR_VENDA: number;
    PEDIDOS: number,
    CONTATOS: number,
    DISCADAS: number
}

export async function getAllUsersService(startDate: Date, endDate: Date) {
    const usersRepository = AppDataSource.getRepository(VOperadoresStatus);
    const historicoRepository = AppDataSource.getRepository(OperadorStatusLog);

    const [dados] = await usersRepository.findAndCount();
    const operadoresComHistoricoStatus: OperadorComHistoricoStatus[] = [];

    const startDF = converterDataParaDiaMesAno(startDate);
    const endDF = converterDataParaDiaMesAno(endDate);

    for (const operador of dados) {
        let codigo_operador = operador.OPERADOR;

        if (!MAGIC_NUMBERS.includes(codigo_operador)) {
            const [PedidoDiscadasContatos]  = await getPedidoDiscadasContatos(codigo_operador, startDF, endDF, historicoRepository);
            const [CLIENTE] = await getLastClient(codigo_operador, historicoRepository);
            const [VALOR_VENDA] = await getValorVenda(codigo_operador, startDF, endDF, historicoRepository);
            const VALOR_PROPOSTA = await getValorProposta(codigo_operador, startDF, endDF, historicoRepository);

            const operadorComHistoricoStatus: OperadorComHistoricoStatus = {
                ...operador,
                CODIGO_CLIENTE: CLIENTE.CLIENTE,
                VALOR_PROPOSTA,
                VALOR_VENDA:VALOR_VENDA.VALOR,
                PEDIDOS : PedidoDiscadasContatos.PEDIDOS,
                CONTATOS : PedidoDiscadasContatos.CONTATOS,
                DISCADAS : PedidoDiscadasContatos.DISCADAS
            };

            operadoresComHistoricoStatus.push(operadorComHistoricoStatus);
        }
    }
    return { dados: operadoresComHistoricoStatus };
}


async function getPedidoDiscadasContatos(codigo_operador: number, startDF: string, endDF: string, historicoRepository: Repository<OperadorStatusLog>) {
    const pedidoDiscadasContatosQuery = `
    SELECT
      COUNT(DISTINCT CC.CODIGO) AS DISCADAS,
      COALESCE(CAST(SUM(IF(RES.ECONTATO='SIM',1,0)) AS CHAR), 0) AS CONTATOS,
      COALESCE(CAST(SUM(IF(RES.EPEDIDO='SIM',1,0)) AS CHAR), 0) AS PEDIDOS
    FROM
        CAMPANHAS_CLIENTES CC
    LEFT JOIN RESULTADOS RES ON RES.CODIGO = CC.RESULTADO
    WHERE
        CC.OPERADOR_LIGACAO = ? AND
        DATE(CC.data_hora_lig) BETWEEN ? AND ?;
  `;
  
  const pedidoDiscadasContatosQueryResult = await historicoRepository.query(pedidoDiscadasContatosQuery, [codigo_operador, startDF, endDF]);
  
  return pedidoDiscadasContatosQueryResult;
  }
async function getLastClient(codigo_operador: number, historicoRepository: Repository<OperadorStatusLog>) {
    return await historicoRepository.query("SELECT CLIENTE FROM campanhas_clientes WHERE campanhas_clientes.OPERADOR = ? ORDER BY CODIGO DESC LIMIT 1; ", [codigo_operador]);
}

async function getValorVenda(codigo_operador: number, startDF: string, endDF: string, historicoRepository: Repository<OperadorStatusLog>) {
    const valorQuery = `
        SELECT SUM(cc.VALOR) as VALOR
        FROM compras cc
        WHERE cc.OPERADOR = ? AND cc.DATA BETWEEN ? AND ?
    `;

    const valorResult = await historicoRepository.query(valorQuery, [codigo_operador, startDF, endDF]);

    return valorResult;
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
function converterDataParaDiaMesAno(dataComHoras:any) {
    const data = new Date(dataComHoras);
    const dia = data.getDate();
    const mes = data.getMonth() + 1; 
    const ano = data.getFullYear();
  
    const dataFormatada = `${ano}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;
  
    return dataFormatada;
  }
  