import { 
    Column,
    Entity, 
    JoinColumn, 
    ManyToOne, 
    OneToOne, 
    PrimaryGeneratedColumn, 
} from "typeorm";
import { Chat } from "./chat.entity";

@Entity('mensagens')
export class Message {
    @PrimaryGeneratedColumn()
    CODIGO: number;

    @Column({ type: 'int', nullable: false})
    CODIGO_CHAT: number;

    @Column({ type: 'varchar', length: 30 })
    TIPO: string;

    @Column({ type: 'text', nullable: true})
    MENSAGEM: string;

    @Column({ type: 'tinyint' })
    FROM_ME: boolean;

    @Column({ type: 'datetime' })
    DATA_HORA: Date;

    @ManyToOne(() => Chat, chat => chat.messages)
    @JoinColumn({ name: 'CODIGO_CHAT' })
    chat: Chat;
};