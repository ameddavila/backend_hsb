import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "TiposHorario" })
export default class TipoHorarioModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  tipoHorarioId!: number;

  @Column(DataType.STRING)
  nombre!: string;

  @Column(DataType.STRING)
  descripcion?: string;
}
