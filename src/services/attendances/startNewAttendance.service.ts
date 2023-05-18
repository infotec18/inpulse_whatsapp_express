import { number } from "zod";
import services from "..";
import { UserSessions } from "../../WebSocket/UsersSessions";
import { runningAttendances } from "../../WebSocket/WhatsappClient";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";
import { ClientCampaign } from "../../entities/clientCampaign.entity";
import { Customer } from "../../entities/customer";
import { Wnumber } from "../../entities/wnumber.entity";
import { RetrieveMessage } from "../../interfaces/attendances.interfaces";
import { Sessions } from "../../WebSocket/Sessions";

interface Props {
    operator: UserSessions;
    client: Customer;
    number: Wnumber;
    ativoRecep: "ATIVO" | "RECEP";
    messages?: RetrieveMessage[];
    avatar?: string;
};

export async function startNewAttendanceService(props: Props) {
    try {
        const CCRepository = AppDataSource.getRepository(ClientCampaign);
        const ContactsRepositorry = AppDataSource.getRepository(Wnumber);

        const findCC = await CCRepository.findOneBy({ 
            CLIENTE: props.client.CODIGO,
            CONCLUIDO: "NAO"
        });
    
        const newAttendance: Attendance = await services.attendances.create({
            CODIGO_OPERADOR: props.operator.userId,
            CODIGO_CLIENTE: props.client.CODIGO,
            CODIGO_NUMERO: props.number.CODIGO,
            CODIGO_CC: findCC ? findCC.CODIGO : null,
            CONCLUIDO: 0,
            DATA_INICIO: new Date(),
            DATA_FIM: null,
            CODIGO_OPERADOR_ANTERIOR: findCC ? findCC.OPERADOR : 0,
            DATA_AGENDAMENTO: null,
            URGENCIA_OPERADOR: "NORMAL",
            ATIVO_RECEP: props.ativoRecep
        });

        const findNumber = newAttendance && await ContactsRepositorry.findOneBy({ CODIGO: newAttendance.CODIGO_NUMERO })
    
        if(findCC && findNumber) {
            findCC.OPERADOR_LIGACAO = props.operator.userId;
            findCC.CONCLUIDO = "SIM";
            findCC.TELEFONE_LIGADO = findNumber.NUMERO;
            await CCRepository.save(findCC);
        };

        let messages: Array<RetrieveMessage> = [];
        if(props.messages) messages = props.messages;
    
        runningAttendances.create({
            CODIGO_ATENDIMENTO: newAttendance.CODIGO,
            CODIGO_CLIENTE: newAttendance.CODIGO_CLIENTE,
            CODIGO_OPERADOR: newAttendance.CODIGO_OPERADOR,
            CODIGO_OPERADOR_ANTERIOR: newAttendance.CODIGO_OPERADOR_ANTERIOR,
            CODIGO_NUMERO: newAttendance.CODIGO_NUMERO,
            CODIGO_CC: findCC?.CODIGO || null,
            CPF_CNPJ: props.client.CPF_CNPJ,
            DATA_INICIO: newAttendance.DATA_INICIO,
            URGENCIA_OPERADOR: "NORMAL",
            URGENCIA_AGENDAMENTO: null,
            URGENCIA_SUPERVISOR: null,
            EXPIRADO: false,
            NOME: props.number.NOME,
            RAZAO: props.client.RAZAO,
            WPP_NUMERO: props.number.NUMERO,
            MENSAGENS: messages
        });
        
        const session = await Sessions.getOperatorSession(props.operator.userId);

        session && Sessions.updateOperatorRunningAttendances(session.userId, session.attendances + 1);

        console.log(new Date().toLocaleString(), ": Novo atendimento para operador de ID", props.operator.userId, " | cliente de ID ", props.client.CODIGO, "| Contato de ID ", props.number.CODIGO);

        return newAttendance;
    } catch(err) {
        console.error(err);
    };
};