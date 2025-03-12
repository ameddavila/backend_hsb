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
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4, // Genera UUID automáticamente
  })
  id!: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.UUID, // 💡 Asegura que coincida con el tipo en la tabla Users
    allowNull: false,
  })
  userId!: string;

  @BelongsTo(() => UserModel)
  user!: UserModel;

  @Column({
    type: DataType.STRING(255), // ✅ Cambiado de NVARCHAR(MAX) a STRING(255)
    allowNull: false,
    unique: true, // ✅ Ahora es válido
  })
  token!: string;

  @Column({
    type: DataType.STRING(255), // ✅ Almacena User-Agent o identificador de dispositivo
    allowNull: false,
  })
  deviceId!: string;

  @Column({
    type: DataType.DATE, // ✅ Define la fecha de expiración
    allowNull: false,
  })
  expiresAt!: Date;

  @Column({
    type: DataType.DATE, // ✅ Última vez que se usó el token
    allowNull: true,
  })
  lastUsedAt!: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive!: boolean;
}
