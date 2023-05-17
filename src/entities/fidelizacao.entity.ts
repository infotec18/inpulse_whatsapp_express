import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('fidelizacoes')
@Index('FK_FID_CC1', ['cc_codigo'])
@Index('FK_FID_OPE', ['operador_criacao'])
@Index('IDX_FID_CLI', ['cliente'])
export class Fidelizacao {
  @PrimaryGeneratedColumn()
  codigo: number;

  @Column()
  cliente: number;

  @Column()
  cc_codigo: number;

  @Column({ nullable: true })
  cod_origem: number | null;

  @Column()
  qtde_fidelizar: number;

  @Column({ nullable: true })
  dt_criacao: Date | null;

  @Column({ nullable: true })
  operador_criacao: number | null;
}