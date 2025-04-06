import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "FuentesFinanciamiento" })
export default class FuenteFinanciamientoModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  fuenteId!: number;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  nombre!: string;

  @Column({ type: DataType.STRING(20), allowNull: false, unique: true })
  codigo!: string;
}
