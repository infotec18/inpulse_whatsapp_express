import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";
import { runningAttendances } from "../../WebSocket/WhatsappClient";
import services from "..";
import WhatsappWeb from "../../WebSocket/WhatsappClient";

export async function updateAttendanceStatus(): Promise<void> {
    const attendanceRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);

    const scheduledAttendances: Attendance[] = await attendanceRepository
        .createQueryBuilder("attendance")
        .where("attendance.DATA_AGENDAMENTO IS NOT NULL")
        .getMany();

    const agora = new Date();
    const dataLimite = new Date(agora.getTime() + 15 * 60 * 1000);
        
    const result = scheduledAttendances.filter(item => { item.DATA_AGENDAMENTO && item.DATA_AGENDAMENTO >= agora && item.DATA_AGENDAMENTO <= dataLimite });
        
    result.forEach(async(attendance) => { 
        const number = await services.wnumbers.getById(attendance.CODIGO_NUMERO);
        const pfp = await WhatsappWeb.getProfilePicUrl(`${number?.NUMERO}@c.us`);

        number && runningAttendances.create({
            CODIGO_ATENDIMENTO: attendance.CODIGO,
            CODIGO_CLIENTE: attendance.CODIGO_CLIENTE,
            CODIGO_NUMERO: attendance.CODIGO_NUMERO,
            CODIGO_OPERADOR: attendance.CODIGO_OPERADOR,
            DATA_INICIO: new Date(),
            MENSAGENS: [],
            WPP_NUMERO: number.NUMERO,
            AVATAR: pfp || ""
        });

        attendanceRepository.save({ ...attendance, DATA_AGENDAMENTO: null, CONCLUIDO: 0 });
    });
};