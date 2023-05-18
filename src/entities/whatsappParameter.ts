import { 
    Column,
    Entity, 
    PrimaryGeneratedColumn, 
} from "typeorm";

@Entity('whatsapp_parametros')
export class Wparameter {
    @PrimaryGeneratedColumn()
    CODIGO: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    NOME: string;

    @Column({ type: 'text', nullable: true, default: null })
    VALOR: string | null; 
};