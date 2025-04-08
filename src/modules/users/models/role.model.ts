// src/modules/users/models/role.model.ts

import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from "sequelize-typescript";
import PermissionModel from "./permission.model";
import RolePermissionModel from "./rolePermission.model";
import MenuModel from "./menu.model";
import RoleMenuModel from "./roleMenu.model";
import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyAddAssociationsMixin,
} from "sequelize";

@Table({ tableName: "Roles" })
export default class RoleModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updatedAt!: Date;

  // ✅ Relación Role ↔ Permission
  @BelongsToMany(() => PermissionModel, () => RolePermissionModel)
  permissions?: PermissionModel[];

  public getPermissions!: BelongsToManyGetAssociationsMixin<PermissionModel>;
  public addPermission!: BelongsToManyAddAssociationMixin<PermissionModel, number>;
  public addPermissions!: BelongsToManyAddAssociationsMixin<PermissionModel, number>;
  public setPermissions!: BelongsToManySetAssociationsMixin<PermissionModel, number>;

  // ✅ Relación Role ↔ Menu
  @BelongsToMany(() => MenuModel, () => RoleMenuModel)
  menus?: MenuModel[];

  public getMenus!: BelongsToManyGetAssociationsMixin<MenuModel>;
  public addMenu!: BelongsToManyAddAssociationMixin<MenuModel, number>;
  public addMenus!: BelongsToManyAddAssociationsMixin<MenuModel, number>;
  public setMenus!: BelongsToManySetAssociationsMixin<MenuModel, number>;
}
