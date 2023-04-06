import { 
    Column,
    Entity, 
    JoinColumn, 
    OneToOne, 
    PrimaryGeneratedColumn, 
} from "typeorm";
import { ReadyMessages } from "./readyMessages.entity";

@Entity('mensagensprontas_arquivos')
export class ReadyMessageFile {
    @PrimaryGeneratedColumn()
    CODIGO: number;

    @Column({ type: 'int', nullable: false})
    CODIGO_MENSAGEM: number;

    @Column({ type: 'varchar', length: 30 })
    TIPO: string;

    @Column({ type: 'text' })
    ARQUIVO: string;

    @OneToOne(() => ReadyMessages, message => message.ARQUIVO)
    @JoinColumn({ name: 'CODIGO_MENSAGEM' })
    message: ReadyMessages;
};