import { Repository } from "typeorm";
import { Attendance } from "../../entities/attendance.entity";
import { AppDataSource } from "../../data-source";
import { Request } from "express";
import { AppError } from "../../errors";

interface GetAttendancesByTypeOptions {
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
  { limite = 10, pagina = 1, filters }: GetAttendancesByTypeOptions = {}
): Promise<{ attendance: Attendance[]; total: number }> {
  const attendanceRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);

  const tipo = req.query.tipo as string | undefined;

  if (tipo === undefined) {
    throw new AppError("Tipo não especificado", 400);
  }

  let query = attendanceRepository.createQueryBuilder("attendance").leftJoinAndSelect("attendance.MENSAGENS", "message");

  if (tipo === "finalizados") {
    query = query.where("attendance.CONCLUIDO = :concluido", { concluido: true }).andWhere("attendance.DATA_AGENDAMENTO IS NULL");
  } else if (tipo === "agendamentos") {
    query = query.where("attendance.DATA_AGENDAMENTO IS NOT NULL");
  } else {
    throw new AppError("Tipo inválido", 400);
  }

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      switch (key) {
        case "search":
          query = query.andWhere("attendance.CONTATO LIKE :search", { search: `%${value}%` });
          break;
        case "prioridade":
          query = query.andWhere("attendance.PRIORIDADE = :prioridade", { prioridade: value });
          break;
        case "contato":
          query = query.andWhere("attendance.CONTATO = :contato", { contato: value });
          break;
        case "cliente":
          query = query.andWhere("attendance.CLIENTE = :cliente", { cliente: value });
          break;
        case "operador":
          query = query.andWhere("attendance.OPERADOR = :operador", { operador: value });
          break;
        case "dataInicio":
          query = query.andWhere("attendance.DATA_ABERTURA >= :dataInicio", { dataInicio: value });
          break;
        case "finalizadoEm":
          query = query.andWhere("attendance.DATA_CONCLUSAO = :finalizadoEm", { finalizadoEm: value });
          break;
        default:
          break;
      }
    });
  }

  const [attendance, total] = await query.skip((pagina - 1) * limite).take(limite).getManyAndCount();
  return { attendance, total };
}
