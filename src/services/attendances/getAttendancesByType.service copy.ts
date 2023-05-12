import { Repository } from "typeorm";
import { Attendance } from "../../entities/attendance.entity";
import { AppDataSource } from "../../data-source";
import { Request } from "express";
import { AppError } from "../../errors";
import { Customer } from "../../entities/customer";

interface GetAttendancesOptions {
  limite?: number;
  pagina?: number;
  filters?: {
    search?: string;
    prioridade?: string;
    contato?: string;
    cliente?: string;
    operador?: string;
    dataInicio?: Date;
    finalizadoEm?: Date;
  };
}

export async function getAttendancesByType(
  req: Request,
  { limite = 10, pagina = 1, filters }: GetAttendancesOptions = {}
): Promise<{ attendance: Attendance[]; total: number }> {
  const attendanceRepository: Repository<Attendance> =
    AppDataSource.getRepository(Attendance);

    const filter = req.query
    const tipo = req.query.tipo as string | undefined;

    if (tipo === undefined) {
      throw new AppError("Tipo não especificado", 400);
    }
  
    let query = attendanceRepository
      .createQueryBuilder("attendance")
      .leftJoinAndSelect("attendance.MENSAGENS", "message");
  
    if (tipo === "finalizados") {
      query = query
        .where("attendance.CONCLUIDO = :concluido", { concluido: true })
        .andWhere("attendance.DATA_AGENDAMENTO IS NULL");
    } else if (tipo === "agendamentos") {
      query = query.where("attendance.DATA_AGENDAMENTO IS NOT NULL");
    } else {
      throw new AppError("Tipo inválido", 400);
    }


    if (filter.prioridade) {
      query = query.andWhere("attendance.URGENCIA = :prioridade", {
        prioridade: filter.prioridade,
      });
    }

    if (filter.contato) {
      const customersRepository: Repository<Customer> = AppDataSource.getRepository(Customer);

      const [dados, total]  = await customersRepository.createQueryBuilder("clientes_numeros")
      .orderBy('clientes.CODIGO', 'ASC')
      .andWhere('clientes.NOME LIKE :search', {search: `%${filter.contato}%`}).getManyAndCount()
            
      const contactIds = dados.map(c => c.CODIGO);
      query = query.andWhere("attendance.CODIGO_NUMERO in (:...ids)", {
        ids: contactIds,      
      });
    }

    if (filter.cliente) {
      const customersRepository: Repository<Customer> = AppDataSource.getRepository(Customer);

      const [dados, total]  = await customersRepository.createQueryBuilder("clientes")
      .orderBy('clientes.CODIGO', 'ASC')
      .andWhere('clientes.RAZAO LIKE :search', {search: `%${filter.cliente}%`}).getManyAndCount()
            
      const customerIds = dados.map(c => c.CODIGO);
      query = query.andWhere("attendance.CODIGO_CLIENTE in (:...ids)", {
        ids: customerIds,
      });
    }

    if (filter.operador) {
      query = query.andWhere("attendance.CODIGO_OPERADOR LIKE :operador", {
        operador: filter.operador,
      });
    }

    if (filter.dataInicio) {
      query = query.andWhere("attendance.DATA_ABERTURA >= :dataInicio", {
        dataInicio: filter.dataInicio,
      });
    }

    if (filter.finalizadoEm) {
      query = query.andWhere("attendance.DATA_FECHAMENTO <= :finalizadoEm", {
        finalizadoEm: filter.finalizadoEm,
      });
    }

  const [attendance, total] = await query
    .skip((pagina - 1) * limite)
    .take(limite)
    .getManyAndCount();
  return { attendance, total };
}