import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import RoleModel from "./role.model";
import MenuModel from "./menu.model";

@Table({ tableName: "RoleMenus" })
export default class RoleMenuModel extends Model {
  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  roleId!: number;

  @ForeignKey(() => MenuModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  menuId!: number;

  @BelongsTo(() => RoleModel)
  role!: RoleModel;

  @BelongsTo(() => MenuModel)
  menu!: MenuModel;
}
