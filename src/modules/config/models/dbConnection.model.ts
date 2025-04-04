import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "config_Connections" })
export default class DbConnectionModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  nombre!: string;

  @Column(DataType.STRING)
  descripcion?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  host!: string;

  @Column({ type: DataType.INTEGER, defaultValue: 1433 })
  puerto!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  usuario!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  contrasena!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  baseDatos!: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  ssl!: boolean;
}
