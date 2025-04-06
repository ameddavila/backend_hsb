import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
import EmpleadoModel from "./empleado.model";

@Table({ tableName: "CredencialesBiometricas" })
export default class CredencialBiometricaModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  credencialId!: number;

  @ForeignKey(() => EmpleadoModel)
  @Column({ field: 'empleadoId', type: DataType.INTEGER })
  empleadoId!: number;

  @Column(DataType.STRING)
  tipo!: string;

  @Column(DataType.STRING)
  dedo?: string;

  @Column(DataType.BLOB)
  valor!: Buffer;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  activo!: boolean;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  fechaRegistro!: Date;
}
