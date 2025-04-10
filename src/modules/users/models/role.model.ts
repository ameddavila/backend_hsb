// ✅ FILE: src/modules/users/models/role.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";

import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManySetAssociationsMixin,
} from "sequelize";

import PermissionModel from "./permission.model";
import MenuModel from "./menu.model";

@Table({ tableName: "Roles" })
export default class RoleModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  description?: string;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt!: Date;

  // ✅ Métodos para permisos
  public addPermission!: BelongsToManyAddAssociationMixin<PermissionModel, number>;
  public addPermissions!: BelongsToManyAddAssociationsMixin<PermissionModel, number>;
  public getPermissions!: BelongsToManyGetAssociationsMixin<PermissionModel>;
  public setPermissions!: BelongsToManySetAssociationsMixin<PermissionModel, number>;

  // ✅ Métodos para menús
  public addMenu!: BelongsToManyAddAssociationMixin<MenuModel, number>;
  public addMenus!: BelongsToManyAddAssociationsMixin<MenuModel, number>;
  public getMenus!: BelongsToManyGetAssociationsMixin<MenuModel>;
  public setMenus!: BelongsToManySetAssociationsMixin<MenuModel, number>;
}
