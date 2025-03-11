import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "Permissions" })
export default class PermissionModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  name!: string; // Se agregó este campo

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  module!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  action!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updatedAt!: Date;
}
