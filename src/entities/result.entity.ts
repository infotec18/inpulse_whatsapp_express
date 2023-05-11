import { 
    Column,
    Entity, 
    PrimaryColumn, 
} from "typeorm";
import { ScheduleUrgency } from "../interfaces/attendances.interfaces";

@Entity('resultados')
export class Result {
    @PrimaryColumn({ type: 'int' })
    CODIGO: number;

    @Column({ type: 'varchar', length: 50, nullable: true, default: ''})
    NOME: string;

    @Column({ type: 'enum', enum: ['SIM', 'NAO'], nullable: true, default: 'NAO' })
    UTILIZAR_AGENDA: 'SIM' | 'NAO';

    @Column({ type: 'enum', enum: ['SIM', 'NAO'], nullable: true, default: 'NAO' })
    FIDELIZARCOTACAO: 'SIM' | 'NAO';

    @Column({ type: 'int', nullable: true, default: 5 })
    QTDE_FIDELIZARCOTACAO: number;

    @Column({ type: 'varchar', length: 50, nullable: true, default: null })
    WHATS_ACAO: string;

    @Column({ type: 'enum', enum: ['MUITO_ALTA', 'ALTA', 'MEDIA', 'NORMAL'], default: null, nullable: true })
    WHATS_URGENCIA_AGENDAMENTO: ScheduleUrgency;

    @Column({ type: 'boolean', default: false })
    WHATS_ALTERAR_AGENDAMENTO: boolean;
};