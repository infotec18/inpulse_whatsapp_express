import { Repository } from "typeorm";
import { Attendance } from "../../entities/attendance.entity";
import { AppDataSource } from "../../data-source";
import { Request } from "express";
import { AppError } from "../../errors";

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

  let query = attendanceRepository
    .createQueryBuilder("attendance")
    .leftJoinAndSelect("attendance.MENSAGENS", "message");

  if (filters) {
    if (filters.search) {
      query = query.andWhere("attendance.CONTATO LIKE :search", {
        search: `%${filters.search}%`,
      });
    }

    if (filters.prioridade) {
      query = query.andWhere("attendance.PRIORIDADE = :prioridade", {
        prioridade: filters.prioridade,
      });
    }

    if (filters.contato) {
      query = query.andWhere("attendance.CONTATO = :contato", {
        contato: filters.contato,
      });
    }

    if (filters.cliente) {
      query = query.andWhere("attendance.CLIENTE = :cliente", {
        cliente: filters.cliente,
      });
    }

    if (filters.operador) {
      query = query.andWhere("attendance.OPERADOR = :operador", {
        operador: filters.operador,
      });
    }

    if (filters.dataInicio) {
      query = query.andWhere("attendance.DATA_ABERTURA >= :dataInicio", {
        dataInicio: filters.dataInicio,
      });
    }

    if (filters.finalizadoEm) {
      query = query.andWhere("attendance.DATA_FECHAMENTO <= :finalizadoEm", {
        finalizadoEm: filters.finalizadoEm,
      });
    }
  }

  const [attendance, total] = await query
    .skip((pagina - 1) * limite)
    .take(limite)
    .getManyAndCount();
  return { attendance, total };
}
