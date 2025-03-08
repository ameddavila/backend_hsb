import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import UserModel from "@modules/users/models/user.model";

@Table({ tableName: "RefreshTokens", timestamps: true })
export default class RefreshTokenModel extends Model {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  token!: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;

  @BelongsTo(() => UserModel)
  user!: UserModel;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiresAt!: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive!: boolean; // ✅ Evita que un refreshToken sea reutilizado tras logout
}
