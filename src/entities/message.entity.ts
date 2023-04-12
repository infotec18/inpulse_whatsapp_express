import { 
    Column,
    Entity, 
    JoinColumn, 
    ManyToOne, 
    OneToOne, 
    PrimaryGeneratedColumn, 
} from "typeorm";
import { Attendance } from "./attendance.entity";
import { MessageFile } from "./messageFile.entity";

@Entity('mensagens')
export class Message {
    @PrimaryGeneratedColumn()
    CODIGO: number;

    @Column({ type: 'int', nullable: false})
    CODIGO_ATENDIMENTO: number;

    @Column({ type: 'varchar', length: 30 })
    TIPO: string;

    @Column({ type: 'text', nullable: true, default: null})
    MENSAGEM: string;

    @Column({ type: 'tinyint' })
    FROM_ME: boolean;

    @Column({ type: 'datetime' })
    DATA_HORA: Date;

    @Column({ type: 'bigint' })
    TIMESTAMP: number;

    @Column({ type: 'varchar', length: 50, nullable: false })
    ID: string;

    @Column({ type: 'varchar', length: 255, nullable: true, default: null })
    ID_REFERENCIA: string | null;

    @ManyToOne(() => Attendance, att => att.MENSAGENS)
    @JoinColumn({ name: 'CODIGO_ATENDIMENTO' })
    ATENDIMENTO: Attendance;

    @OneToOne(() => MessageFile, file => file.MENSAGEM)
    ARQUIVO: MessageFile;
};