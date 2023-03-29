import { 
    Column,
    Entity, 
    JoinColumn, 
    ManyToOne, 
    OneToOne, 
    PrimaryGeneratedColumn, 
} from "typeorm";
import { Attendance } from "./attendance.entity";

@Entity('mensagens')
export class Message {
    @PrimaryGeneratedColumn()
    CODIGO: number;

    @Column({ type: 'int', nullable: false})
    CODIGO_ATENDIMENTO: number;

    @Column({ type: 'varchar', length: 30 })
    TIPO: string;

    @Column({ type: 'text', nullable: true})
    MENSAGEM: string;

    @Column({ type: 'tinyint' })
    FROM_ME: boolean;

    @Column({ type: 'datetime' })
    DATA_HORA: Date;

    @ManyToOne(() => Attendance, att => att.MENSAGENS)
    @JoinColumn({ name: 'CODIGO_ATENDIMENTO' })
    ATENDIMENTO: Attendance;
};