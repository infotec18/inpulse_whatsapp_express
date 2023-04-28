import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";
import { runningAttendances } from "../../WebSocket/WhatsappClient";
import { ClientCampaign } from "../../entities/clientCampaign.entity";
import { Sessions } from "../../WebSocket/Sessions";

export async function finishAttendanceService(COD_ATENDIMENTO: number, COD_RESULTADO: number, CAMPANHA: number): Promise<void>  {

    const AttendanceRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);
    const ClientCampaignRepository: Repository<ClientCampaign> = AppDataSource.getRepository(ClientCampaign);

    const findAttendance: Attendance | null = await AttendanceRepository.findOneBy({ CODIGO: COD_ATENDIMENTO });

    if(findAttendance) {
        AttendanceRepository.save({
            CODIGO: COD_ATENDIMENTO,
            CONCLUIDO: 1,
            DATA_FIM: new Date(),
        });

        await ClientCampaignRepository.save({
            CAMPANHA: CAMPANHA,
            CLIENTE: findAttendance.CODIGO_CLIENTE,
            CONCLUIDO: "SIM",
            DT_AGENDAMENTO: new Date(),
            DT_RESULTADO: new Date(),
            DATA_HORA_LIG: new Date(),
            DATA_HORA_FIM: new Date(),
            RESULTADO: COD_RESULTADO,
            OPERADOR: findAttendance.CODIGO_OPERADOR
        });

        runningAttendances.remove(COD_ATENDIMENTO);
        runningAttendances.returnOperatorAttendances(findAttendance.CODIGO_OPERADOR);

        const session = await Sessions.getOperatorSession(findAttendance.CODIGO_OPERADOR);
        if(session) {
            Sessions.updateOperatorRunningAttendances(session.userId, session.attendances - 1);
        };
    };

    return;
};