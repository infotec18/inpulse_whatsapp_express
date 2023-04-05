import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";

export async function getAllRunningAttendancesService(): Promise<Array<Attendance>> {

    const AttendanceRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);

    const findAttendances: Attendance[] = await AttendanceRepository.findBy({ CONCLUIDO: 0 });

    return findAttendances;
};