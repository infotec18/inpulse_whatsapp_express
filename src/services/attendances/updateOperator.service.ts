import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";
import { runningAttendances } from "../../WebSocket/WhatsappClient";

export async function updateOperator(cod: number, operator: number): Promise<void> {
    const AttendancesRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);
    let findAttendance = await AttendancesRepository.findOneBy({ CODIGO: cod });

    if(findAttendance) {
        runningAttendances.transferOperator(findAttendance.CODIGO, operator);
        findAttendance.CODIGO_OPERADOR = operator;
        await AttendancesRepository.save(findAttendance);
    };
};
