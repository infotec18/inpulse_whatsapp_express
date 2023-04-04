import { getRounds, hashSync } from "bcryptjs";
import { 
    BeforeInsert,
    BeforeUpdate,
    Column, 
    Entity, 
    OneToMany, 
    PrimaryColumn, 
} from "typeorm";
import { Attendance } from "./attendance.entity";

@Entity('operadores')
export class User {
    @PrimaryColumn()
    CODIGO: number;

    @Column({ type: 'enum', enum: ['SIM', 'NAO'], default: 'SIM' })
    ATIVO: string;

    @Column({ type: 'varchar', length: 255 })
    NOME: string;

    @Column({ type: 'varchar', length: 255 })
    LOGIN: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    EMAIL: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    SENHA: string;

    @Column({ type: 'varchar', length: 45, unique: true })
    EXPIRA_EM: string;

    @Column({ type: 'enum', enum: ['ATIVO', 'RECEPTIVO', 'AMBOS', 'ADMIN'], default: 'ATIVO' })
    NIVEL: string;

    @Column({ type: 'varchar', length: 255, unique: true, nullable: true})
    CODIGO_ERP: string;

    @Column({ type: 'datetime', nullable: true })
    ULTIMO_LOGIN_INI: string;

    @Column({ type: 'datetime', nullable: true })
    ULTIMO_LOGIN_FIM: string;

    @Column({ type: 'datetime' })
    DATACAD: Date;

    @BeforeInsert()
    @BeforeUpdate()
    encryptPassword(){
        const isEncrypted = getRounds(this.SENHA);
        if(!isEncrypted) this.SENHA = hashSync(this.SENHA, 10);
    };

};