import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "Auditoria" })
export default class AuditoriaModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  auditoriaId!: number;

  @Column(DataType.STRING)
  tablaAfectada!: string;

  @Column(DataType.STRING)
  accion!: string;

  @Column(DataType.STRING)
  usuario!: string;

  @Column(DataType.TEXT)
  datosAnteriores?: string;

  @Column(DataType.TEXT)
  datosNuevos?: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  fechaRegistro!: Date;

  @Column(DataType.STRING)
  ipUsuario?: string;
}