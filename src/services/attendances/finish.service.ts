import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";
import { ClientCampaign } from "../../entities/clientCampaign.entity";
import { runningAttendances } from "../../WebSocket/WhatsappClient";

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
            DT_AGENDAMENTO: findAttendance.DATA_AGENDAMENTO,
            DT_RESULTADO: new Date(),
            DATA_HORA_LIG: findAttendance.DATA_INICIO,
            DATA_HORA_FIM: new Date(),
            RESULTADO: COD_RESULTADO,
            OPERADOR: findAttendance.CODIGO_OPERADOR
        });

        runningAttendances.remove(COD_ATENDIMENTO);
    };

    return;
};