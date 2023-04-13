import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";
import { runningAttendances } from "../../WebSocket/WhatsappClient";


export async function updateSchedulingDate(cod: number, date: Date): Promise<void> {
    const AttendancesRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);
    
    await AttendancesRepository.update(cod, { DATA_AGENDAMENTO: date, CONCLUIDO: 1 });

    runningAttendances.remove(cod);
};
