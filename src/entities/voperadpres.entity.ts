import { Entity, ViewColumn, PrimaryColumn, Column } from "typeorm";

@Entity({ name: 'v_operadores_status', synchronize: false })
export class VOperadoresStatus {
    @PrimaryColumn()
    OPERADOR: number;

    @Column({ type: 'varchar', length: 255 })
    STATUS_ATUAL: string;

    @Column({ type: 'integer' })
    TEMPO: number;

    @Column({ type: 'varchar', length: 255 })
    NOME: string;
}
