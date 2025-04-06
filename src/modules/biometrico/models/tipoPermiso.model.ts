import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "TiposPermiso" })
export default class TipoPermisoModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  tipoPermisoId!: number;

  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  nombre!: string;

  @Column({ type: DataType.STRING(255) })
  descripcion?: string;
}
