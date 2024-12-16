import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  Index,
} from "sequelize-typescript";
import UserRoleModel from "./userRole.model";
import RoleModel from "./role.model";

@Table({ tableName: "Users" })
export default class UserModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Index({ unique: true }) // Índice único separado para `username`
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    validate: {
      len: [3, 50], // Validación de longitud
    },
  })
  username!: string;

  @Index({ unique: true }) // Índice único separado para `email`
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    validate: {
      isEmail: true, // Validación de formato de email
    },
  })
  email!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    validate: {
      len: [8, 255], // La contraseña debe tener al menos 8 caracteres
    },
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

  @BelongsToMany(() => RoleModel, {
    through: { model: () => UserRoleModel },
    foreignKey: "userId",
    otherKey: "roleId",
    as: "roles",
  })
  roles?: RoleModel[];
}
