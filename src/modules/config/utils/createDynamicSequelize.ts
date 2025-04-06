import { Sequelize } from "sequelize-typescript";
import { rrhhModels } from "@modules/biometrico/models";
import { associateBiometricoModels } from "@modules/biometrico/relationships/biometrico.relations"

interface ConnectionConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

export const createDynamicSequelize = async (config: ConnectionConfig): Promise<Sequelize> => {
  const sequelize = new Sequelize({
    dialect: "mssql",
    host: config.host,
    port: config.port,
    database: config.database,
    username: config.username,
    password: config.password,
    logging: false,
    dialectOptions: {
      options: {
        encrypt: config.ssl ?? false,
        trustServerCertificate: true,
      },
    },
    timezone: "America/La_Paz",
  });

  // Agregar modelos y relaciones
  sequelize.addModels(rrhhModels);
  associateBiometricoModels();

  await sequelize.authenticate();
  return sequelize;
};
