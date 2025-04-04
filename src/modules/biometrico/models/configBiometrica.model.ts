import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
import DispositivoModel from "./dispositivo.model";

@Table({ tableName: "bio_ConfigBiometrica" })
export default class ConfigBiometricaModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  configId!: number;

  @Column(DataType.STRING)
  descripcion!: string;

  @Column(DataType.STRING)
  tipoConexion!: string;

  @Column(DataType.STRING)
  nombreBD!: string;

  @Column(DataType.STRING)
  usuarioBD!: string;

  @Column(DataType.BLOB)
  contrasenaBD!: Buffer;

  @Column(DataType.STRING)
  servidorBD!: string;

  @Column(DataType.INTEGER)
  puertoBD!: number;

  @ForeignKey(() => DispositivoModel)
  @Column(DataType.INTEGER)
  dispositivoId!: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  sslHabilitado!: boolean;

  @Column(DataType.DATE)
  ultimaSincronizacion?: Date;
}