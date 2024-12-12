import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import RoleModel from "./role.model";
import PermissionModel from "./permission.model";

@Table({ tableName: "RolePermissions" })
export default class RolePermissionModel extends Model {
  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  roleId!: number;

  @ForeignKey(() => PermissionModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  permissionId!: number;

  @BelongsTo(() => RoleModel)
  role!: RoleModel;

  @BelongsTo(() => PermissionModel)
  permission!: PermissionModel;
}
