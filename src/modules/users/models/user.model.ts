import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import UserRoleModel from "./userRole.model";

@Table({ tableName: "Users" })
export default class UserModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  username!: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  email!: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  password!: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  firstName!: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  lastName!: string;

  @Column({ type: DataType.STRING(20), allowNull: true })
  phone?: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  isActive!: boolean;

  @Column({ type: DataType.STRING(255), allowNull: true })
  profileImage?: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  passwordResetToken?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  passwordResetExpires?: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt!: Date;

  @HasMany(() => UserRoleModel)
  userRoles!: UserRoleModel[];
}
