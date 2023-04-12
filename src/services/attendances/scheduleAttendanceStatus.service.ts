import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";

export async function updateAttendanceStatus(): Promise<Array<Attendance>> {

    const attendanceRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);

    const scheduledAttendances: Attendance[] = await attendanceRepository
        .createQueryBuilder("attendance")
        .where("attendance.DATA_AGENDAMENTO IS NOT NULL")
        .getMany();

    const agora = new Date();
    const dataLimite = new Date(agora.getTime() + 15 * 60 * 1000);
        
    const result = scheduledAttendances.filter(item => {item.DATA_AGENDAMENTO >= agora && item.DATA_AGENDAMENTO <= dataLimite;
        });
        

    return result;
}