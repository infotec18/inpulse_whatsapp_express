import { Customer } from "../entities/customer";
import { Message } from "../entities/message.entity";

export type RetrieveMessage = Message | Message & { ARQUIVO: string, TIPO: string}

export interface RunningAttendance {
    CODIGO_ATENDIMENTO: number;
    CODIGO_OPERADOR: number;
    CODIGO_CLIENTE: number;
    CODIGO_NUMERO: number;
    WPP_NUMERO: string;
    MENSAGENS: RetrieveMessage[];
};

export interface CustomerRegistrationData {
    CPF_CNPJ?: string;
    RAZAO?: string;
    FANTASIA?: string;
    PESSOA?: "FIS" | "JUR";
};

export interface RunningRegistration {
    WPP_NUMERO: string;
    ETAPA: number;
    DADOS: CustomerRegistrationData;
    CONCLUIDO: boolean;
    CADASTRO_CLIENTE?: Customer;
};

export interface RegistrationReply {
    registration: RunningRegistration,
    reply: string | null
};

export interface Session {
    socketId: string;
    userId: number;
    admin: boolean;
};