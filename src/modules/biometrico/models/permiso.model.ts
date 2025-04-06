import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
import EmpleadoModel from "./empleado.model";
import TipoPermisoModel from "./tipoPermiso.model";

@Table({ tableName: "Permisos" })
export default class PermisoModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  permisoId!: number;

  @ForeignKey(() => EmpleadoModel)
  @Column({ field: 'empleadoId', type: DataType.INTEGER })
  empleadoId!: number;

  @ForeignKey(() => TipoPermisoModel)
  @Column({ field: 'tipoPermisoId', type: DataType.INTEGER })
  tipoPermisoId!: number;

  @Column(DataType.DATEONLY)
  fechaInicio!: string;

  @Column(DataType.DATEONLY)
  fechaFin!: string;

  @Column(DataType.TIME)
  horaInicio?: string;

  @Column(DataType.TIME)
  horaFin?: string;

  @Column(DataType.STRING)
  diasSemana?: string;

  @Column(DataType.STRING)
  observacion?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  aprobado!: boolean;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  fechaRegistro!: Date;
}
