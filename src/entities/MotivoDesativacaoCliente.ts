import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MotivoDesativacaoCliente {
  @PrimaryGeneratedColumn()
  OPERADOR: number;

  @Column()
  CLIENTE: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  DATAHORA: Date;

  @Column({ type: 'text', collation: 'latin1_swedish_ci' })
  MOTIVO: string;
}
