import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('operadores_status_log')
export class OperadorStatusLog {
  @PrimaryColumn({ type: "int" }) 
  OPERADOR: number;

  @Column({ type: "date" })
  DATA: Date;

  @Column({ type: "time" })
  HORA: string;

  @Column({ type: "int" })
  STATUS: number;
}
