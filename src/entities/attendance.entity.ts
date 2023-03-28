import { 
    Column,
    Entity, 
    PrimaryGeneratedColumn, 
} from "typeorm";

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
};