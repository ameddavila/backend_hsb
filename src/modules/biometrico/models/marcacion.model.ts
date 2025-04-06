import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
import EmpleadoModel from "./empleado.model";
import DispositivoModel from "./dispositivo.model";

@Table({ tableName: "Marcaciones" })
export default class MarcacionModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  marcacionId!: number;

  @ForeignKey(() => EmpleadoModel)
  @Column({ field: 'empleadoId', type: DataType.INTEGER })
  empleadoId!: number;

  @ForeignKey(() => DispositivoModel)
  @Column({ field: 'dispositivoId', type: DataType.INTEGER })
  dispositivoId!: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  fechaHora!: Date;

  @Column(DataType.STRING)
  tipoMarcacion!: string;

  @Column(DataType.STRING)
  metodoAutenticacion?: string;

  @Column(DataType.FLOAT)
  puntajeCoincidencia!: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  valida!: boolean;
}
