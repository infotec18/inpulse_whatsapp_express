import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";

export async function findAttendanceService(COD: number): Promise<Attendance | null> {

    const AttendanceRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);

    const findAttendance: Attendance | null = await AttendanceRepository.findOneBy({
        CODIGO_NUMERO: COD, CONCLUIDO: 0
    });

    if(findAttendance) {
        const findScheduledAttendance: Attendance | null = await AttendanceRepository 
            .createQueryBuilder("attendance")
            .where("attendance.DATA_AGENDAMENTO IS NOT NULL")
            .andWhere(`attendance.CODIGO_CLIENTE = ${COD}`)
            .getOne();

        if(findScheduledAttendance) {
            const scheduledAttendance = await AttendanceRepository.save({ ...findScheduledAttendance, CONCLUIDO: 0, DATA_AGENDAMENTO: "" })
            return scheduledAttendance;
        };
    };

    return findAttendance;
};