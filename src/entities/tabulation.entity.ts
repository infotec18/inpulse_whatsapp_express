import { 
    Column,
    Entity, 
    JoinColumn, 
    ManyToOne, 
    PrimaryGeneratedColumn, 
} from "typeorm";
import { Attendance } from "./attendance.entity";

@Entity('atendimentos_historico')
export class Tabulation {
    @PrimaryGeneratedColumn()
    CODIGO: number;

    @Column({ type: 'int', nullable: false})
    CODIGO_ATENDIMENTO: number;

    @Column({ type: 'text', nullable: false})
    MENSAGEM: string;

    @Column({ type: 'datetime', nullable: false})
    DATA_HORA: Date;

    @ManyToOne(() => Attendance, att => att.HISTORICO)
    @JoinColumn({ name: 'CODIGO_ATENDIMENTO' })
    ATENDIMENTO: Attendance;
};