// src/modules/biometrico/models/configBiometrica.model.ts
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import DbConnectionModel from "@modules/config/models/dbConnection.model"; // ✅ Importado

@Table({
  tableName: "config_biometrica",
  timestamps: false,
})
export default class ConfigBiometricaModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  configId!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  descripcion!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  tipoConexion!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  nombreBD!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  usuarioBD!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  servidorBD!: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  puertoBD!: number;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  sslHabilitado!: boolean;

  @AllowNull(true)
  @Column(DataType.DATE)
  ultimaSincronizacion?: Date;

  // ✅ NUEVA RELACIÓN: conexión remota asociada
  @ForeignKey(() => DbConnectionModel)
  @Column(DataType.INTEGER)
  dbConnectionId!: number;

  @BelongsTo(() => DbConnectionModel, { foreignKey: "dbConnectionId", as: "conexionRemota" })
  conexionRemota!: DbConnectionModel;
}
