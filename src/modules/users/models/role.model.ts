import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import UserRoleModel from "./userRole.model";
import RolePermissionModel from "./rolePermission.model";
import RoleMenuModel from "./roleMenu.model";

@Table({ tableName: "Roles" })
export default class RoleModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  name!: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  description?: string;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt!: Date;

  @HasMany(() => RolePermissionModel)
  rolePermissions!: RolePermissionModel[];

  @HasMany(() => RoleMenuModel)
  roleMenus!: RoleMenuModel[];

  @HasMany(() => UserRoleModel)
  roleUsers!: UserRoleModel[];
}
