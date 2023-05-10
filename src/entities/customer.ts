import { 
    Column,
    Entity, 
    OneToMany, 
    PrimaryColumn, 
} from "typeorm";
import { Wnumber } from "./wnumber.entity";

@Entity('clientes')
export class Customer {
    @PrimaryColumn()
    CODIGO: number;

    @Column({ type: 'varchar', length: '100' })
    RAZAO: string;

    @Column({ type: 'varchar', length: '60' })
    FANTASIA: string;

    @Column({ type: 'enum', enum: ['FIS', 'JUR'], default: 'JUR' })
    PESSOA: "FIS" | "JUR";

    @Column({ type: 'enum', enum: ['SIM', 'NAO'], default: 'SIM' })
    ATIVO: string;

    @Column({ type: 'varchar', length: '16' })
    CPF_CNPJ: string;

    @Column({ type: 'datetime', default: '0000-00-00 00:00:00' })
    DATACAD: Date;

    @Column({ type: 'date', default: '0000-00-00' })
    ULTI_RESULTADO: string;

    @Column({ type: 'date', default: '0000-00-00' })
    DT_AGENDAMENTO: string;
    
    @Column({ type: 'varchar', length: '20', default: null })
    COD_ERP: string | null;

    @Column({ type: 'int' })
    OPERADOR: number;

    @Column({ type: 'int' })
    ORIGEM: number;

    @Column({ type: 'int' })
    AREA1: number;

    @Column({ type: 'varchar', length: 12})
    FONE1: string;

    @Column({ type: 'varchar', length: 30})
    DESC_FONE1: string;

    @OneToMany(() => Wnumber, wnumber => wnumber.CLIENTE, { cascade: true })
    TELEFONES: Wnumber[];
};
