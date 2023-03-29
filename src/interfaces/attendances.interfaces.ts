import { Customer } from "../entities/customer";

export interface RunningAttendance {
    CODIGO_ATENDIMENTO: number,
    CODIGO_OPERADOR: number,
    WPP_NUMERO: string
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