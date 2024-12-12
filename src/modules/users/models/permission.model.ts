import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
} from "sequelize-typescript";
import RolePermissionModel from "./rolePermission.model";

@Table({ tableName: "Permissions" })
export default class PermissionModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  module!: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  action!: string;

  @ForeignKey(() => RolePermissionModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  roleId!: number;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt!: Date;

  @HasMany(() => RolePermissionModel)
  permissionRoles!: RolePermissionModel[];
}
