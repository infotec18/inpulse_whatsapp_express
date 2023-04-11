import { 
    Column,
    Entity, 
    OneToOne, 
    PrimaryGeneratedColumn, 
} from "typeorm";
import { ReadyMessageFile } from "./readyMessageFile.entity";

@Entity('mensagens_prontas')
export class ReadyMessage {
    @PrimaryGeneratedColumn()
    CODIGO: number

    @Column({type: 'boolean'})
    APENAS_ADMIN: boolean

    @Column({type: 'text'})
    TEXTO_MENSAGEM: string

    @Column({type: 'text'})
    TITULO: string

    @OneToOne(() => ReadyMessageFile, file => file.MENSAGEM)
    ARQUIVO: ReadyMessageFile
}