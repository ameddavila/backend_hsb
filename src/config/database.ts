import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import {
  UserModel,
  RoleModel,
  PermissionModel,
  MenuModel,
  UserRoleModel,
  RolePermissionModel,
  RoleMenuModel,
} from "../modules/users/models";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

let sequelize: Sequelize;

try {
  console.log("Iniciando configuración de Sequelize...");

  sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string, 10) || 1433,
    dialect: "mssql",
    dialectOptions: {
      options: {
        encrypt: isProduction,
        trustServerCertificate: !isProduction,
        instanceName: process.env.DB_INSTANCE,
        timezone: "Z",
      },
    },
    logging: false, //console.log,
    timezone: "America/La_Paz",
    models: [
      UserModel,
      RoleModel,
      PermissionModel,
      MenuModel,
      UserRoleModel,
      RolePermissionModel,
      RoleMenuModel,
    ],
  });

  console.log(
    "✅ Modelos registrados en Sequelize:",
    Object.keys(sequelize.models)
  );
} catch (error) {
  console.error("❌ Error al configurar Sequelize:", error);
  process.exit(1);
}

export default sequelize;
