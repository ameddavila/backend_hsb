import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import UserModel from "./user.model";
import RoleModel from "./role.model";

@Table({ tableName: "UserRoles" })
export default class UserRoleModel extends Model {
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.CHAR(36), allowNull: false })
  userId!: string;

  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  roleId!: number;

  @BelongsTo(() => UserModel)
  user!: UserModel;

  @BelongsTo(() => RoleModel)
  role!: RoleModel;
}
