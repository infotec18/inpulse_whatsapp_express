import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { VOperadoresStatus } from "../../entities/voperadpres.entity";
import { OperadorStatusLog } from '../../entities/operadoresStatusLog.entity';

const MAGIC_NUMBERS = [12, 11, 1];

interface OperadorComHistoricoStatus {
  OPERADOR: number;
  NOME: string;
  STATUS_ATUAL: string;
  TEMPO: number;
  CODIGO_CLIENTE: number;
  VALOR_PROPOSTA: number;
  VALOR_VENDA: number;
  PEDIDOS: number;
  CONTATOS: number;
  DISCADAS: number;
}

export async function getAllUsersService(startDate: Date, endDate: Date) {
  const usersRepository = AppDataSource.getRepository(VOperadoresStatus);
  const historicoRepository = AppDataSource.getRepository(OperadorStatusLog);

  // Pega todos os operadores filtrando os magic numbers
  const [dados] = await usersRepository.findAndCount();
  const operadoresFiltrados = dados.filter(op => !MAGIC_NUMBERS.includes(op.OPERADOR));
  const operadoresCodigos = operadoresFiltrados.map(op => op.OPERADOR);

  const startDF = converterDataParaDiaMesAno(startDate);
  const endDF = converterDataParaDiaMesAno(endDate);

  // Executa todas as queries em paralelo
  const [
    discadasContatosPedidos,
    ultimosClientes,
    valoresVenda,
    valoresProposta
  ] = await Promise.all([
    getPedidoDiscadasContatosBatch(operadoresCodigos, startDate, endDate, historicoRepository),
    getLastClientBatch(operadoresCodigos, historicoRepository),
    getValorVendaBatch(operadoresCodigos, startDF, endDF, historicoRepository),
    getValorPropostaBatch(operadoresCodigos, startDF, endDF, historicoRepository),
  ]);

  // Monta o resultado final, usando Maps para lookup rápido
  const operadoresComHistoricoStatus: OperadorComHistoricoStatus[] = operadoresFiltrados.map(op => {
    const codigo = op.OPERADOR;
    return {
      ...op,
      CODIGO_CLIENTE: ultimosClientes.get(codigo) || 0,
      VALOR_PROPOSTA: valoresProposta.get(codigo) || 0,
      VALOR_VENDA: valoresVenda.get(codigo) || 0,
      PEDIDOS: discadasContatosPedidos.get(codigo)?.PEDIDOS || 0,
      CONTATOS: discadasContatosPedidos.get(codigo)?.CONTATOS || 0,
      DISCADAS: discadasContatosPedidos.get(codigo)?.DISCADAS || 0,
    };
  });

  return { dados: operadoresComHistoricoStatus };
}

// === Funções Batch com Map para lookup rápido === //

async function getPedidoDiscadasContatosBatch(
  codigos: number[],
  startDate: Date,
  endDate: Date,
  repo: Repository<OperadorStatusLog>
): Promise<Map<number, { PEDIDOS: number; CONTATOS: number; DISCADAS: number }>> {
  if (codigos.length === 0) return new Map();

  const query = `
    SELECT
      CC.OPERADOR_LIGACAO AS OPERADOR,
      COUNT(DISTINCT CC.CODIGO) AS DISCADAS,
      SUM(IF(RES.ECONTATO='SIM',1,0)) AS CONTATOS,
      SUM(IF(RES.EPEDIDO='SIM',1,0)) AS PEDIDOS
    FROM CAMPANHAS_CLIENTES CC
    LEFT JOIN RESULTADOS RES ON RES.CODIGO = CC.RESULTADO
    WHERE CC.OPERADOR_LIGACAO IN (${codigos.join(',')})
      AND DATE(CC.data_hora_lig) BETWEEN ? AND ?
    GROUP BY CC.OPERADOR_LIGACAO`;

  const result = await repo.query(query, [MysqlDate(startDate), MysqlDate(endDate)]);
  return new Map(result.map((r: any) => [r.OPERADOR, {
    PEDIDOS: Number(r.PEDIDOS) || 0,
    CONTATOS: Number(r.CONTATOS) || 0,
    DISCADAS: Number(r.DISCADAS) || 0,
  }]));
}

async function getLastClientBatch(
  codigos: number[],
  repo: Repository<OperadorStatusLog>
): Promise<Map<number, number>> {
  if (codigos.length === 0) return new Map();

  const query = `
    SELECT cc.OPERADOR, cc.CLIENTE
    FROM campanhas_clientes cc
    INNER JOIN (
      SELECT OPERADOR, MAX(CODIGO) AS MAX_CODIGO
      FROM campanhas_clientes
      WHERE OPERADOR IN (${codigos.join(',')})
      GROUP BY OPERADOR
    ) ult ON cc.OPERADOR = ult.OPERADOR AND cc.CODIGO = ult.MAX_CODIGO`;

  const result = await repo.query(query);
  return new Map(result.map((r: any) => [r.OPERADOR, Number(r.CLIENTE) || 0]));
}

async function getValorVendaBatch(
  codigos: number[],
  start: string,
  end: string,
  repo: Repository<OperadorStatusLog>
): Promise<Map<number, number>> {
  if (codigos.length === 0) return new Map();

  const query = `
    SELECT OPERADOR, SUM(VALOR) as VALOR
    FROM compras
    WHERE OPERADOR IN (${codigos.join(',')})
      AND DATA BETWEEN ? AND ?
    GROUP BY OPERADOR`;

  const result = await repo.query(query, [start, end]);
  return new Map(result.map((r: any) => [r.OPERADOR, parseFloat(r.VALOR) || 0]));
}

async function getValorPropostaBatch(
  codigos: number[],
  start: string,
  end: string,
  repo: Repository<OperadorStatusLog>
): Promise<Map<number, number>> {
  if (codigos.length === 0) return new Map();

  const query = `
    SELECT a.OPERADOR, SUM(p.VALOR) as VALOR
    FROM campanhas_clientes a
    INNER JOIN propostas p ON p.LIGACAO = a.CODIGO
    WHERE a.OPERADOR IN (${codigos.join(',')})
      AND a.DT_RESULTADO BETWEEN ? AND ?
    GROUP BY a.OPERADOR`;

  const result = await repo.query(query, [start, end]);
  return new Map(result.map((r: any) => [r.OPERADOR, parseFloat(r.VALOR) || 0]));
}

// === Utils === //

function MysqlDate(date: number | Date): string {
  const newDate = new Date(date);
  return newDate.toISOString().slice(0, 19).replace('T', ' ');
}

function converterDataParaDiaMesAno(data: Date): string {
  const d = new Date(data);
  const dia = d.getDate();
  const mes = d.getMonth() + 1;
  const ano = d.getFullYear();
  return `${ano}-${mes < 10 ? '0' + mes : mes}-${dia < 10 ? '0' + dia : dia}`;
}
