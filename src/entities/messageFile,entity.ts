import { 
    Column,
    Entity, 
    PrimaryGeneratedColumn, 
} from "typeorm";

@Entity('mensagens_arquivos')
export class MessageFile {
    @PrimaryGeneratedColumn()
    CODIGO: number;

    @Column({ type: 'int', nullable: false})
    CODIGO_MENSAGEM: number;

    @Column({ type: 'varchar', length: 30 })
    TIPO: string;

    @Column({ type: 'longblob', nullable: true})
    ARQUIVO: string;
};