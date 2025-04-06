import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'Zonas' })
export default class ZonaModel extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  zonaId!: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  nombre!: string;

  @Column(DataType.STRING)
  descripcion?: string;
}
