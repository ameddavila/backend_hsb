import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import RoleMenuModel from "./roleMenu.model";

@Table({ tableName: "Menus" })
export default class MenuModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  path!: string;

  @Column({ type: DataType.STRING(50), allowNull: true })
  icon?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  parentId?: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive!: boolean;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  sortOrder!: number;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt!: Date;

  @HasMany(() => RoleMenuModel, { as: "menuRoles" })
  menuRoles!: RoleMenuModel[];
}
