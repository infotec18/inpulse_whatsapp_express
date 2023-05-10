import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";
import { runningAttendances } from "../../WebSocket/WhatsappClient";
import { OperatorUrgency, ScheduleUrgency, SupervisorUrgency } from "../../interfaces/attendances.interfaces";

export async function updateStatus(cod: number, status: OperatorUrgency | ScheduleUrgency | SupervisorUrgency, mode: "Supervisor" | "Schedule" | "Operator"): Promise<void> {
    const AttendancesRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);
    let findAttendance = await AttendancesRepository.findOneBy({ CODIGO: cod });

    if (findAttendance) {
        if (mode === "Supervisor") findAttendance.URGENCIA_SUPERVISOR = status as SupervisorUrgency;
        if (mode === "Schedule") findAttendance.URGENCIA_AGENDAMENTO = status as ScheduleUrgency;
        if (mode === "Operator") findAttendance.URGENCIA_OPERADOR = status as OperatorUrgency;

        await AttendancesRepository.save(findAttendance);

        runningAttendances.update(cod, { 
            URGENCIA_SUPERVISOR: findAttendance.URGENCIA_SUPERVISOR,
            URGENCIA_AGENDAMENTO: findAttendance.URGENCIA_AGENDAMENTO, 
            URGENCIA_OPERADOR: findAttendance.URGENCIA_OPERADOR
        });
    };
};