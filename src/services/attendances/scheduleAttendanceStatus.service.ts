import { AppDataSource } from "../../data-source";
import { runningAttendances } from "../../WebSocket/WhatsappClient";
import services from "..";
import WhatsappWeb from "../../WebSocket/WhatsappClient";
import { Attendance } from "../../entities/attendance.entity";

export async function updateAttendanceStatus(): Promise<void> {
    const attendanceRepository= AppDataSource.getRepository(Attendance);

    const scheduledAttendances: Attendance[] = await attendanceRepository
        .createQueryBuilder("attendance")
        .where("attendance.DATA_AGENDAMENTO IS NOT NULL")
        .getMany();

    const currentTime = Date.now(); 
    const scheduleTime = (date: Date) => date.getTime() - 300000;
    
    const currentSchedule = scheduledAttendances.filter(a => scheduleTime(a.DATA_AGENDAMENTO!) <= currentTime);

    console.log(new Date().toLocaleString(), ": Total de agendamentos: ", scheduledAttendances.length);
    console.log(new Date().toLocaleString(), ": Agendamentos encontrados para agora: ", currentSchedule.length);

    currentSchedule.forEach(async(attendance) => { 
        const number = await services.wnumbers.getById(attendance.CODIGO_NUMERO);
        const client = await services.customers.getOneById(attendance.CODIGO_CLIENTE);

        const isAttending = runningAttendances.find({ CODIGO_NUMERO: attendance.CODIGO_NUMERO });
        
        const avatar = process.env.OFICIAL_WHATSAPP === "false" ? (number && await WhatsappWeb.getProfilePicUrl(`${number.NUMERO}@c.us`)) : null;

        if(!isAttending) {
            number && client && runningAttendances.create({
                CODIGO_ATENDIMENTO: attendance.CODIGO,
                CODIGO_CLIENTE: attendance.CODIGO_CLIENTE,
                CODIGO_NUMERO: attendance.CODIGO_NUMERO,
                CODIGO_OPERADOR: attendance.CODIGO_OPERADOR,
                CODIGO_OPERADOR_ANTERIOR: attendance.CODIGO_OPERADOR_ANTERIOR,
                DATA_INICIO: new Date(),
                MENSAGENS: [],
                WPP_NUMERO: number.NUMERO,
                AVATAR: avatar || "",
                URGENCIA_SUPERVISOR: attendance.URGENCIA_SUPERVISOR,
                URGENCIA_AGENDAMENTO: attendance.URGENCIA_AGENDAMENTO, 
                URGENCIA_OPERADOR: attendance.URGENCIA_OPERADOR,
                NOME: number.NOME,
                CPF_CNPJ: client.CPF_CNPJ,
                RAZAO: client.RAZAO,
            });

            attendanceRepository.save({ ...attendance, DATA_AGENDAMENTO: "", CONCLUIDO: 0 });
            
        } else {
            attendanceRepository.save({ ...attendance, DATA_AGENDAMENTO: "" });
        };
    });
};