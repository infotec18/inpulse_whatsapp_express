import { Customer } from "../entities/customer";
import { Message } from "../entities/message.entity";
import { MessageFile } from "../entities/messageFile.entity";

export type RetrieveMessage = Message | Message & { ARQUIVO: MessageFile }

export interface RunningAttendance {
    CODIGO_ATENDIMENTO: number;
    CODIGO_OPERADOR: number;
    CODIGO_CLIENTE: number;
    CODIGO_NUMERO: number;
    WPP_NUMERO: string;
    MENSAGENS: RetrieveMessage[];
    AVATAR?: string;
    DATA_INICIO: Date;
    URGENCIA: Urgency;
    NOME: string;
    CPF_CNPJ: string;
    RAZAO: string;
};

export interface CustomerRegistrationData {
    CPF_CNPJ?: string;
    RAZAO?: string;
    FANTASIA?: string;
    PESSOA?: PersonType;
};

export interface RunningRegistration {
    WPP_NUMERO: string;
    ETAPA: number;
    ETAPA_COUNT: number;
    DADOS: CustomerRegistrationData;
    CONCLUIDO: boolean;
    CADASTRO_CLIENTE?: Customer;
};

export interface RegistrationReply {
    registration: RunningRegistration,
    reply: string | null
};

export interface RunningSurvey {
    WPP_NUMERO: string;
    COD_ATENDIMENTO: number;
    ETAPA: number;
    ETAPA_COUNT: number;
    CONCLUIDO: boolean;
    NOTA?: number;
    COMENTARIO?: string;
};

export interface BotReply<T> {
    registration: T,
    reply: string | null
};

export interface Session {
    socketId: string;
    userId: number;
};

export interface FinishAttendanceProps {
    CODIGO_ATENDIMENTO: number;
    CODIGO_RESULTADO: number;
};

export interface ScheduleInformation {
    AVATAR: string;
    NOME: string;
    EMPRESA: string;
    CPF_CNPJ: string;
    PESSOA: PersonType;
    CODIGO_ATENDIMENTO: number;
    URGENCIA: Urgency;
    DATA_FIM_ULTIMO_ATENDIMENTO: Date | null;
    DATA_AGENDAMENTO: Date;
};

export type Urgency = "URGENTE" | "ALTA" | "NORMAL";
export type PersonType = "FIS" | "JUR";