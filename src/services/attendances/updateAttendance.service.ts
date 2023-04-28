import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";
import { runningAttendances } from "../../WebSocket/WhatsappClient";


export async function updateSchedulingDate(cod: number, date: Date): Promise<void> {
    const AttendancesRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);
    let findAttendance = await AttendancesRepository.findOneBy({ CODIGO: cod });

    if(findAttendance) {
        findAttendance.DATA_AGENDAMENTO = date;
        findAttendance.CONCLUIDO = 1;

        await AttendancesRepository.save(findAttendance);
        runningAttendances.remove(cod);
        runningAttendances.returnOperatorAttendances(findAttendance.CODIGO_OPERADOR);
    };
};
