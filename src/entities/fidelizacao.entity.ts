import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('fidelizacoes')
@Index('FK_FID_CC1', ['cc_codigo'])
@Index('FK_FID_OPE', ['operador_criacao'])
@Index('IDX_FID_CLI', ['cliente'])
export class Fidelizacao {
  @PrimaryGeneratedColumn()
  codigo: number;

  @Column({ type: 'int' })
  cliente: number;

  @Column({ type: 'int'})
  cc_codigo: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  cod_origem: number | null;

  @Column({ type: 'int'})
  qtde_fidelizar: number;

  @Column({ type: 'datetime', nullable: true })
  dt_criacao: Date | null;

  @Column({ type: 'int', nullable: true })
  operador_criacao: number | null;
}