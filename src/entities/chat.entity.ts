import { 
    Column,
    Entity, 
    OneToMany, 
    OneToOne, 
    PrimaryGeneratedColumn, 
} from "typeorm";
import { Message } from "./message.entity";

@Entity('chats')
export class Chat {
    @PrimaryGeneratedColumn()
    CODIGO: number;

    @Column({ type: 'int', nullable: false})
    CODIGO_CLIENTE: number;

    @Column({ type: 'int', nullable: false})
    CODIGO_NUMERO: number;

    @Column({ type: 'int', nullable: false})
    CODIGO_ATENDIMNETO: number;

    @OneToMany(() => Message, message => message.chat)
    messages: Message[];
};