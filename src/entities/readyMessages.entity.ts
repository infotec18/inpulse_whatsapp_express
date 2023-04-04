import { 
    Column,
    Entity, 
    PrimaryGeneratedColumn, 
} from "typeorm";

@Entity('mensagens_prontas')
export class ReadyMessages {
    @PrimaryGeneratedColumn()
    CODIGO: number

    @Column({type: 'boolean'})
    APENAS_ADMIN: boolean

    @Column({type: 'text'})
    TEXTO_MENSAGEM: string

    @Column({type: 'longblob', nullable:false})
    ARQUIVO: string
}