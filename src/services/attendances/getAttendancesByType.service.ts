import { Repository, Not, IsNull, And } from 'typeorm';
import { Attendance } from '../../entities/attendance.entity';
import { AppDataSource } from '../../data-source';
import { Request } from 'express';

export async function getAttendancesByType(req: Request): Promise<Attendance[]> {
    const AttendanceRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);

    const tipo = req.query.tipo;

    let attendances;

    if (tipo == 'finalizados') {
        attendances = AttendanceRepository.createQueryBuilder('atendimentos')
            .where("atendimentos.CONCLUIDO = 1")
            .andWhere("atendimentos.DATA_AGENDAMENTO IS NULL")
            .leftJoinAndSelect("atendimentos.MENSAGENS", "message")
            .getMany()

    } else if (tipo == 'agendamentos') {
        attendances = AttendanceRepository.createQueryBuilder('atendimentos')
            .andWhere("atendimentos.DATA_AGENDAMENTO IS NOT NULL")
            .leftJoinAndSelect("atendimentos.MENSAGENS", "message")
            .getMany()
    } else {
        throw new Error('Tipo inválido');
    }

    return attendances;
}