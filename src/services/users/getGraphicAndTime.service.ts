import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors";

export async function getLastUserIdService(startDate: Date, endDate: Date) {
    let VendasPorEstado;

    const historicoRepository = AppDataSource.getRepository(User);

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
  
  const vendasPorEstado = await historicoRepository.query(sql, [MysqlDate(startDate), MysqlDate(endDate)]);
  
  if (vendasPorEstado !== null && vendasPorEstado.length > 0) {
    VendasPorEstado = vendasPorEstado;
  }

    return { vendasPorEstado: vendasPorEstado, motivos_pausa: motivos_pausa};
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