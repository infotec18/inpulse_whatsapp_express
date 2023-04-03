import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";

export async function findAttendanceService(COD: number): Promise<Attendance | null> {

    const AttendanceRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);

    const findAttendance: Attendance | null = await AttendanceRepository.findOneBy({
        CODIGO_CLIENTE: COD, CONCLUIDO: 0
    });

    return findAttendance;
};