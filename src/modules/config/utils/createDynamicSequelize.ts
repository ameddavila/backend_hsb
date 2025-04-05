// src/utils/createDynamicSequelize.ts
import { Sequelize } from "sequelize-typescript";
import { rrhhModels, associateRRHHModels } from "@modules/biometrico/models";

interface ConnectionConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

/**
 * Crea una conexión dinámica a una base de datos externa.
 * Ideal para conectar con bdBiometrico.
 */
export const createDynamicSequelize = async (config: ConnectionConfig): Promise<Sequelize> => {
  const sequelize = new Sequelize({
    dialect: "mssql",
    host: config.host,
    port: config.port || 1433,
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

  // Cargar modelos del biométrico solamente en esta instancia
  sequelize.addModels(rrhhModels);
  associateRRHHModels();

  // Probar la conexión
  await sequelize.authenticate();
  console.log(`✅ Conectado correctamente a la base de datos remota: ${config.database}`);
  return sequelize;
};
