import { 
    Column,
    Entity, 
    OneToMany, 
    PrimaryGeneratedColumn, 
} from "typeorm";
import { Message } from "./message.entity";
import { Tabulation } from "./tabulation.entity";
import { Urgency } from "../interfaces/attendances.interfaces";

@Entity('atendimentos')
export class Attendance {
    @PrimaryGeneratedColumn()
    CODIGO: number;

    @Column({ type: 'int' })
    CODIGO_OPERADOR: number;

    @Column({ type: 'int' })
    CODIGO_OPERADOR_ANTERIOR: number;

    @Column({ type: 'int', nullable: false })
    CODIGO_CLIENTE: number;

    @Column({ type: 'int', nullable: false })
    CODIGO_NUMERO: number;

    @Column({ type: 'tinyint', nullable: true, default: 0 })
    CONCLUIDO: number | null;

    @Column({ type: 'datetime' })
    DATA_INICIO: Date;

    @Column({ type: 'datetime', nullable: true })
    DATA_FIM: Date | null;

    @Column({ type: 'datetime', nullable: true })
    DATA_AGENDAMENTO: Date | null;

    @Column({ type: 'enum', enum: ['URGENTE', 'MUITO_ALTA', 'ALTA', 'MEDIA', 'NORMAL'], default: 'NORMAL' })
    URGENCIA: Urgency;

    @OneToMany(() => Message, message => message.ATENDIMENTO)
    MENSAGENS: Message[];

    @OneToMany(() => Tabulation, tabulation => tabulation.ATENDIMENTO)
    HISTORICO: Tabulation[];
};