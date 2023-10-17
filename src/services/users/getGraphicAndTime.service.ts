import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors";

export async function getLastUserIdService(startDate: Date, endDate: Date) {
    let VendasPorEstado;

    const historicoRepository = AppDataSource.getRepository(User);

    const startDF = converterDataParaDiaMesAno(startDate);
    const endDF = converterDataParaDiaMesAno(endDate);

    const motivos_pausa = await historicoRepository.query("SELECT * FROM motivos_pausa");
    
    const sql = `
    SELECT cli.ESTADO, SUM(cc.VALOR) as VALOR
    FROM compras cc
    JOIN clientes cli on cli.CODIGO = cc.CLIENTE AND cli.ESTADO <> ''
    WHERE cc.OPERADOR > 0 AND cc.DATA BETWEEN ? AND ?
    GROUP BY cli.ESTADO
    HAVING SUM(cc.VALOR) > 0
    ORDER BY COUNT(cc.CODIGO) DESC
  `;
  
  const vendasPorEstado = await historicoRepository.query(sql, [startDF, endDF]);
  
  if (vendasPorEstado !== null && vendasPorEstado.length > 0) {
    VendasPorEstado = vendasPorEstado;
  }

  console.log("vendas por estado",vendasPorEstado)
    return { vendasPorEstado: vendasPorEstado, motivos_pausa: motivos_pausa};
};
function converterDataParaDiaMesAno(dataComHoras:any) {
    const data = new Date(dataComHoras);
    const dia = data.getDate();
    const mes = data.getMonth() + 1; 
    const ano = data.getFullYear();
  
    const dataFormatada = `${ano}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;
  
    return dataFormatada;
  }