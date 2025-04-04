import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import  DispositivoModel  from './dispositivo.model';

@Table({ tableName: 'Zonas' })
export default class ZonaModel extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  ZonaId!: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  Nombre!: string;

  @Column(DataType.STRING)
  Descripcion?: string;

  @HasMany(() => DispositivoModel)
  dispositivos?: DispositivoModel[];
}
