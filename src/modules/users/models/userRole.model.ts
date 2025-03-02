// src/modules/users/models/userRole.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import UserModel from "@modules/users/models/user.model";
import RoleModel from "@modules/users/models/role.model";

@Table({ tableName: "UserRoles" })
export default class UserRoleModel extends Model {
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.CHAR(36), allowNull: false, primaryKey: true })
  userId!: string;

  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true })
  roleId!: number;

  @BelongsTo(() => UserModel)
  user!: UserModel;

  @BelongsTo(() => RoleModel)
  role!: RoleModel;
}
