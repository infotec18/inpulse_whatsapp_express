import { 
    Column,
    Entity, 
    PrimaryColumn, 
} from "typeorm";

@Entity('resultados')
export class Result {
    @PrimaryColumn({ type: 'int' })
    CODIGO: number;

    @Column({ type: 'varchar', length: 50, nullable: true, default: ''})
    NOME: string;

    @Column({ type: 'enum', enum: ['SIM', 'NAO'], nullable: true, default: 'NAO'})
    UTILIZAR_AGENDA: 'SIM' | 'NAO';
};