import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
import TipoHorarioModel from "./tipoHorario.model";

@Table({ tableName: "bio_DetalleHorario" })
export default class DetalleHorarioModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  detalleHorarioId!: number;

  @ForeignKey(() => TipoHorarioModel)
  @Column(DataType.INTEGER)
  tipoHorarioId!: number;

  @Column(DataType.TIME)
  horaInicio!: string;

  @Column(DataType.TIME)
  horaFin!: string;

  @Column(DataType.INTEGER)
  orden!: number;
}