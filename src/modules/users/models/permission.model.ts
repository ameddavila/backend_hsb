import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from "sequelize-typescript";
import RoleModel from "./role.model";
import RolePermissionModel from "./rolePermission.model";

@Table({ tableName: "Permissions" })
export default class PermissionModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING(50), allowNull: false }) // ✅ Aquí
  action!: string;

  @Column({ type: DataType.STRING(50), allowNull: false }) // ✅ Si también usas 'module'
  module!: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  description?: string;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt!: Date;

  @BelongsToMany(() => RoleModel, () => RolePermissionModel)
  roles?: RoleModel[];
}
