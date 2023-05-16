import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";
import { runningAttendances } from "../../WebSocket/WhatsappClient";
import { sendWhatsappMessageService } from "../whatsapp/sendMessage.service";
import { User } from "../../entities/user.entity";

export async function updateOperator(cod: number, operator: number): Promise<void> {
    const AttendancesRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);
    const OperatorsRepositor: Repository<User> = AppDataSource.getRepository(User);

    const findAttendance = await AttendancesRepository.findOneBy({ CODIGO: cod });
    const findOperator = await OperatorsRepositor.findOneBy({ CODIGO: operator });
    
    if(findAttendance && findOperator ) {
        const runningAttendance = runningAttendances.find({ CODIGO_ATENDIMENTO: findAttendance.CODIGO })

        const transferString = `Seu atendimento foi transferido, ${findOperator.NOME} é seu novo atendente.`

        runningAttendance && sendWhatsappMessageService({
            text: transferString,
            to: runningAttendance.WPP_NUMERO,
            type: "text",
            fromBot: true
        });

        runningAttendances.transferOperator(findAttendance.CODIGO, operator);
        findAttendance.CODIGO_OPERADOR = operator;
        await AttendancesRepository.save(findAttendance);
    };
};
