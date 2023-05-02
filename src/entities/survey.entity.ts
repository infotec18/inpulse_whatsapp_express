import { 
    Column,
    Entity, 
    PrimaryGeneratedColumn, 
} from "typeorm";

@Entity('atendimentos_feedbacks')
export class Survey {
    @PrimaryGeneratedColumn()
    CODIGO: number;

    @Column()
    CODIGO_ATENDIMENTO: number;

    @Column()
    NOTA_ATENDIMENTO: number;

    @Column({ type: 'text', nullable: true })
    COMENTARIO: string | null;
};