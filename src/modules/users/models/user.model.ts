import { Table, Column, Model, DataType, Index } from "sequelize-typescript";
import RoleModel from "@modules/users/models/role.model";

@Table({ tableName: "Users" })
export default class UserModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Index({ unique: true })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    validate: { len: [3, 50] },
  })
  username!: string;

  @Index({ unique: true })
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    validate: { isEmail: true },
  })
  email!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    validate: { len: [8, 255] },
  })
  password!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  firstName!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  lastName!: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  phone?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true, // ✅ Corrección aquí: eliminamos Sequelize.literal
  })
  isActive!: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  profileImage?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  passwordResetToken?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  passwordResetExpires?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  updatedAt!: Date;

  roles?: RoleModel[];
}
