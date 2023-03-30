import { 
    Column,
    Entity, 
    JoinColumn, 
    ManyToOne, 
    PrimaryGeneratedColumn, 
} from "typeorm";
import { Customer } from "./customer";

@Entity('clientes_numeros')
export class Wnumber {
    @PrimaryGeneratedColumn()
    CODIGO: number;

    @Column({ type: 'int',  unique: true, nullable: false})
    CODIGO_CLIENTE: number;

    @Column({ type: 'varchar', length: 30 })
    NOME: string;

    @Column({ type: 'varchar', length: 20, unique: true })
    NUMERO: string;

    @ManyToOne(() => Customer, (customer) => customer.TELEFONES)
    @JoinColumn({ name: 'CODIGO_CLIENTE' })
    CLIENTE: Customer;
};