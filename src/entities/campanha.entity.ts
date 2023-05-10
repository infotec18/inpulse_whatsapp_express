import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('campanhas')
export class Campanha {
  @PrimaryGeneratedColumn()
  CODIGO: number;

  @Column({ nullable: true })
  NOME: string;

  @Column({ type: 'datetime', nullable: true, default: () => '0000-00-00 00:00:00' })
  DATA_INI: Date;

  @Column({ nullable: true, default: 0 })
  MAX_RESPOSTA: number;

  @Column({ type: 'text', nullable: true })
  DESCRICAO: string;

  @Column({ nullable: true, default: 0 })
  PRIORIDADE: number;

  @Column({ type: 'text', nullable: true })
  SQL_CAMPANHA: string;

  @Column({ nullable: true, enum: ['SIM', 'NAO'] })
  GERADO_LISTA: 'SIM' | 'NAO';

  @Column({ nullable: true, enum: ['SIM', 'NAO'] })
  PAUSADA: 'SIM' | 'NAO';

  @Column({ nullable: true, enum: ['SIM', 'NAO'] })
  PAUSAR_AG_PUBLICA: 'SIM' | 'NAO';

  @Column({ nullable: true, enum: ['ATIVOS', 'INAT_R', 'INAT_A', 'PROSPE'] })
  TIPO: 'ATIVOS' | 'INAT_R' | 'INAT_A' | 'PROSPE';

  @Column({ nullable: true, default: 0 })
  UNIDADE: number;

  @Column({ nullable: true })
  OPERADOR: number;
}
