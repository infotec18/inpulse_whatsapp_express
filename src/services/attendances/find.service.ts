import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";
import { AppError } from "../../errors";

export async function findAttendanceService(COD: number): Promise<Attendance | null> {

    const AttendanceRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);

    const findAttendance: Attendance | null = await AttendanceRepository.findOneBy({
        CODIGO_NUMERO: COD, CONCLUIDO: false
    });

    return findAttendance;
};