// src/modules/biometrico/models/zona.model.ts
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
import ConfigBiometricaModel from "./configBiometrica.model";
import DbConnectionModel from "@modules/config/models/dbConnection.model";

@Table({
  tableName: "zona",
  timestamps: false,
})
export default class ZonaModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  zonaId!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  nombre!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  descripcion?: string;

  // 👉 Relación con ConfigBiometrica
  @ForeignKey(() => ConfigBiometricaModel)
  @Column(DataType.INTEGER)
  configId?: number;

  @BelongsTo(() => ConfigBiometricaModel, { foreignKey: "configId", as: "configBiometrica" })
  configBiometrica?: ConfigBiometricaModel;

  // 👉 Relación con config_Connections (de bdCENTRAL)
  @ForeignKey(() => DbConnectionModel)
  @Column(DataType.INTEGER)
  dbConnectionId!: number;

  @BelongsTo(() => DbConnectionModel, { foreignKey: "dbConnectionId", as: "conexionRemota" })
  conexionRemota!: DbConnectionModel;
}
