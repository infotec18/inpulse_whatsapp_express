import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";
import { runningAttendances } from "../../WebSocket/WhatsappClient";

export async function updateStatus(cod: number, status: "URGENTE" | "ALTA" | "NORMAL"): Promise<void> {
    const AttendancesRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);
    let findAttendance = await AttendancesRepository.findOneBy({ CODIGO: cod });

    if(findAttendance) {
        findAttendance.URGENCIA = status;
        await AttendancesRepository.save(findAttendance);
        runningAttendances.update(cod, { URGENCIA: status });
        runningAttendances.returnOperatorAttendances(findAttendance.CODIGO_OPERADOR); 
    };
};
