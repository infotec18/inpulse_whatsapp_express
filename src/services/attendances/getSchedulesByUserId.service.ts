import { Repository } from "typeorm";
import { Attendance } from "../../entities/attendance.entity";
import { AppDataSource } from "../../data-source";
import services from "..";
import WhatsappWeb from "../../WebSocket/WhatsappClient";
import { ScheduleInformation } from "../../interfaces/attendances.interfaces";

export async function getSchedulesByUserIdService(userId: number): Promise<Array<ScheduleInformation>> {
    const attendancesRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);

    const scheduledAttendances: Array<Attendance> = await attendancesRepository
        .createQueryBuilder("attendance")
        .where("attendance.DATA_AGENDAMENTO IS NOT NULL")
        .andWhere(`attendance.CODIGO_OPERADOR = ${userId}`)
        .getMany();

    const arrayWithAllData: Array<ScheduleInformation> = [];

    for (let a of scheduledAttendances) {
        const client = await services.customers.getOneById(a.CODIGO_CLIENTE);
        const employee = await services.wnumbers.getById(a.CODIGO_NUMERO);
        const avatar = process.env.OFICIAL_WHATSAPP === "false" ? (employee && await WhatsappWeb.getProfilePicUrl(`${employee.NUMERO}@c.us`)) : null;

        if (client && employee) {
            arrayWithAllData.push({
                AVATAR: avatar || "",
                NOME: employee.NOME,
                EMPRESA: client.RAZAO,
                CPF_CNPJ: client.CPF_CNPJ,
                PESSOA: client.PESSOA,
                CODIGO_ATENDIMENTO: a.CODIGO,
                URGENCIA_OPERADOR: a.URGENCIA_OPERADOR,
                URGENCIA_AGENDAMENTO: a.URGENCIA_AGENDAMENTO,
                URGENCIA_SUPERVISOR: a.URGENCIA_SUPERVISOR,
                DATA_FIM_ULTIMO_ATENDIMENTO: a.DATA_FIM,
                DATA_AGENDAMENTO: a.DATA_AGENDAMENTO!,
            });
        };
    };

    return arrayWithAllData;
};