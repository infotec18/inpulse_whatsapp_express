import { Repository, Not, IsNull, And } from 'typeorm';
import { Attendance } from '../../entities/attendance.entity';
import { AppDataSource } from '../../data-source';
import { Request } from 'express';

export async function getAttendancesByType(req: Request): Promise<Attendance[]> {
    const AttendanceRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);

    const tipo = req.query.tipo;

    let attendances: Attendance[];

    if (tipo == 'finalizados') {
        attendances = await AttendanceRepository.find({
            where: { CONCLUIDO: 1, DATA_AGENDAMENTO: IsNull() }
        });
    } else if (tipo == 'agendamentos') {
        attendances = await AttendanceRepository.find({
            where: { DATA_AGENDAMENTO: Not(IsNull()) },
        });
    } else {
        throw new Error('Tipo inválido');
    }

    return attendances;
}