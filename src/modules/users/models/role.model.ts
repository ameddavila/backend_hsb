// src/modules/users/models/role.model.ts

import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";
import { BelongsToManyGetAssociationsMixin } from "sequelize"; // <-- Importar
import MenuModel from "./menu.model"; // Ajustar la ruta si es diferente

@Table({ tableName: "Roles" })
export default class RoleModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  description?: string;

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

  /**
   * Mixin declarado para que TypeScript reconozca que
   * Sequelize genera un método getMenus() en tiempo de ejecución.
   */
  public getMenus!: BelongsToManyGetAssociationsMixin<MenuModel>;
}
