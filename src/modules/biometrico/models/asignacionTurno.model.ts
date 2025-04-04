import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
import {EmpleadoModel} from "./empleado.model";
import TipoHorarioModel from "./tipoHorario.model";

@Table({ tableName: "bio_AsignacionTurnos" })
export default class AsignacionTurnoModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  asignacionId!: number;

  @ForeignKey(() => EmpleadoModel)
  @Column(DataType.INTEGER)
  empleadoId!: number;

  @ForeignKey(() => TipoHorarioModel)
  @Column(DataType.INTEGER)
  tipoHorarioId!: number;

  @Column(DataType.DATE)
  fechaEspecifica?: Date;

  @Column(DataType.INTEGER)
  semana?: number;

  @Column(DataType.INTEGER)
  año?: number;

  @Column(DataType.INTEGER)
  diaSemana?: number;

  @Column(DataType.STRING)
  comentario?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  activo!: boolean;
}