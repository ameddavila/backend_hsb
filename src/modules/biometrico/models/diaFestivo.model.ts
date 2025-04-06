import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "DiasFestivos" })
export default class DiaFestivoModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  festivoId!: number;

  @Column({ type: DataType.DATE, allowNull: false, unique: true })
  fecha!: Date;

  @Column({ type: DataType.STRING(100), allowNull: false })
  nombre!: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  recurrente!: boolean;
}