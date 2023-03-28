import { 
    Column,
    Entity, 
    JoinColumn, 
    ManyToOne, 
    OneToOne, 
    PrimaryGeneratedColumn, 
} from "typeorm";
import { Chat } from "./chat.entity";
import { User } from "./user.entity";

@Entity('atendimentos')
export class Attendance {
    @PrimaryGeneratedColumn()
    CODIGO: number;

    @Column({ type: 'int',  unique: true, nullable: false})
    CODIGO_OPERADOR: number;

    @Column({ type: 'int',  unique: true, nullable: false})
    CODIGO_CLIENTE: number;

    @Column({ type: 'int',  unique: true, nullable: false})
    CODIGO_NUMERO: number;

    @Column({ type: 'tinyint' })
    CONCLUIDO: boolean;

    @Column({ type: 'datetime', default: new Date() })
    DATA_INICIO: Date;

    @Column({ type: 'datetime', nullable: true })
    DATA_FIM: Date;

    @ManyToOne(() => User, user => user.ATENDIMENTOS)
    @JoinColumn()
    OPERADOR: User;

    @OneToOne(() => Chat)
    @JoinColumn({ name: 'CODIGO' })
    chat: Chat;
};