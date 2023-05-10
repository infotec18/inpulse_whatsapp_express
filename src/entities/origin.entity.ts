import { 
    Column,
    Entity, 
    PrimaryColumn, 
} from "typeorm";

@Entity('origens_sgr')
export class Origin {
    @PrimaryColumn({ type: 'int' })
    CODIGO: number;

    @Column({ type: 'varchar', length: 35 })
    DESCRICAO: string;
};