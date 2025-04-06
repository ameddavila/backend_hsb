import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "Departamentos" })
export default class DepartamentoModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  departamentoId!: number;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  nombre!: string;
}
