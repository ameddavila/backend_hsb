// src/modules/config/models/dbConnection.model.ts
import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "config_Connections" })
export default class DbConnectionModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  nombre!: string;

  @Column({ type: DataType.STRING(255) })
  descripcion?: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  servidor!: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1433 })
  puerto!: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  usuario!: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  contrasena!: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  baseDatos!: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  ssl!: boolean;
}
