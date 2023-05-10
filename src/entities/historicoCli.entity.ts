import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'historico_cli' })
export class HistoricoCli {
  @PrimaryGeneratedColumn({ name: 'CODIGO' })
  CODIGO: number;

  @Column({ name: 'CAMPANHA', length: 30, nullable: true, default: '', collation: 'latin1_swedish_ci' })
  CAMPANHA: string;

  @Column({ name: 'ATIVO_RECEP', enum: ['ATIVO', 'RECEP'], nullable: true, collation: 'latin1_swedish_ci' })
  ATIVO_RECEP: 'ATIVO' | 'RECEP';

  @Column({ name: 'OPERADOR', length: 35, nullable: true, default: '', collation: 'latin1_swedish_ci' })
  OPERADOR: string;

  @Column({ name: 'DATAHORA_INICIO', type: 'datetime', nullable: true, default: () => '0000-00-00 00:00:00' })
  DATAHORA_INICIO: Date;

  @Column({ name: 'DATAHORA_FIM', type: 'datetime', nullable: true, default: () => '0000-00-00 00:00:00' })
  DATAHORA_FIM: Date;

  @Column({ name: 'RESULTADO', type: 'int', nullable: true, default: 0 })
  RESULTADO: number;

  @Column({ name: 'TELEFONE', length: 15, nullable: true, default: '', collation: 'latin1_swedish_ci' })
  TELEFONE: string;

  @Column({ name: 'OBSERVACAO', type: 'text', nullable: true, collation: 'latin1_swedish_ci' })
  OBSERVACAO: string;

  @Column({ name: 'CLIENTE', type: 'int', nullable: true, default: 0 })
  CLIENTE: number;

  @Column({ name: 'CODIGO_FASE_CONTATO', type: 'int', nullable: true })
  CODIGO_FASE_CONTATO: number;

  @Column({ name: 'CC_CODIGO', type: 'int', nullable: true })
  CC_CODIGO: number;

  @Column({ name: 'MARCA', type: 'int', nullable: true })
  MARCA: number;
};