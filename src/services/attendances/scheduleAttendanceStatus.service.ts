import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { runningAttendances } from "../../WebSocket/WhatsappClient";
import services from "..";
import WhatsappWeb from "../../WebSocket/WhatsappClient";
import { Attendance } from "../../entities/attendance.entity";

export async function updateAttendanceStatus(): Promise<void> {
    const attendanceRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);

    const scheduledAttendances: Attendance[] = await attendanceRepository
        .createQueryBuilder("attendance")
        .where("attendance.DATA_AGENDAMENTO IS NOT NULL")
        .getMany();

    const currentTime = Date.now(); 
    const scheduleTime = (date: Date) => date.getTime() - 300000;
    
    const currentSchedule = scheduledAttendances.filter(a => a.DATA_AGENDAMENTO && scheduleTime(a.DATA_AGENDAMENTO) <= currentTime );

    currentSchedule.forEach(async(attendance) => { 
        const number = await services.wnumbers.getById(attendance.CODIGO_NUMERO);
        const avatar = number && await WhatsappWeb.getProfilePicUrl(`${number.NUMERO}@c.us`)

        number && runningAttendances.create({
            CODIGO_ATENDIMENTO: attendance.CODIGO,
            CODIGO_CLIENTE: attendance.CODIGO_CLIENTE,
            CODIGO_NUMERO: attendance.CODIGO_NUMERO,
            CODIGO_OPERADOR: attendance.CODIGO_OPERADOR,
            DATA_INICIO: new Date(),
            MENSAGENS: [],
            WPP_NUMERO: number.NUMERO,
            AVATAR: avatar || "",
            URGENCIA: attendance.URGENCIA
        });

        runningAttendances.returnOperatorAttendances(attendance.CODIGO_OPERADOR);

        attendanceRepository.save({ ...attendance, DATA_AGENDAMENTO: "", CONCLUIDO: 0 });
    });
};