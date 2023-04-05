import { 
    Column,
    Entity, 
    JoinColumn, 
    OneToOne, 
    PrimaryGeneratedColumn, 
} from "typeorm";
import { Message } from "./message.entity";

@Entity('mensagens_arquivos')
export class MessageFile {
    @PrimaryGeneratedColumn()
    CODIGO: number;

    @Column({ type: 'int', nullable: false})
    CODIGO_MENSAGEM: number;

    @Column({ type: 'varchar', length: 30 })
    TIPO: string;

    @Column({ type: 'text' })
    ARQUIVO: string;

    @OneToOne(() => Message, message => message.arquivo)
    @JoinColumn({ name: 'CODIGO_MENSAGEM' })
    message: Message;
};