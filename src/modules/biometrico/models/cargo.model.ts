import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "Cargos" })
export default class CargoModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  cargoId!: number;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  nombre!: string;

  @Column({ type: DataType.STRING(255) })
  descripcion?: string;
}