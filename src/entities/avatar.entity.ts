import { 
    Column,
    Entity, 
    PrimaryGeneratedColumn, 
} from "typeorm";

@Entity('avatares')
export class Avatar {
    @PrimaryGeneratedColumn()
    CODIGO: number;

    @Column({ type: 'int',  unique: true, nullable: false})
    CODIGO_OPERADOR: number;

    @Column({ type: 'longblob', nullable: true })
    ARQUIVO: ArrayBuffer;
};