import { 
    Column,
    Entity, 
    JoinColumn, 
    ManyToOne, 
    OneToMany, 
    OneToOne, 
    PrimaryGeneratedColumn, 
} from "typeorm";
import { Message } from "./message.entity";
import { Tabulation } from "./tabulation.entity";
import { User } from "./user.entity";

@Entity('atendimentos')
export class Attendance {
    @PrimaryGeneratedColumn()
    CODIGO: number;

    @Column({ type: 'int',  unique: true, nullable: true})
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
    DATA_FIM: string;

    @ManyToOne(() => User, user => user.ATENDIMENTOS)
    @JoinColumn()
    OPERADOR: User;

    @OneToMany(() => Message, message => message.ATENDIMENTO)
    MENSAGENS: Message[];

    @OneToMany(() => Tabulation, tabulation => tabulation.ATENDIMENTO)
    HISTORICO: Tabulation[];
};