import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
import ZonaModel from "./zona.model";

@Table({ tableName: "Dispositivos" })
export default class DispositivoModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  dispositivoId!: number;

  @ForeignKey(() => ZonaModel)
  @Column({ field: 'zonaId', type: DataType.INTEGER })
  zonaId!: number;

  @Column(DataType.STRING)
  nombre!: string;

  @Column({ type: DataType.STRING, unique: true })
  numeroSerie!: string;

  @Column({ type: DataType.STRING(15), unique: true })
  ip!: string;

  @Column(DataType.INTEGER)
  puerto!: number;

  @Column(DataType.STRING)
  ubicacion!: string;

  @Column(DataType.STRING)
  modelo!: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  activo!: boolean;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  fechaRegistro!: Date;
}
