import { Sequelize } from "sequelize-typescript";
import { rrhhModels } from "@modules/biometrico/models";
import {associateBiometricoModels} from "@relationships/biometrico.relations"

interface RemoteConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

/**
 * Inicializa una base de datos remota usando los modelos biométricos
 */
export const initializeRemoteDatabase = async (config: RemoteConfig): Promise<Sequelize> => {
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

  sequelize.addModels(rrhhModels);
  associateBiometricoModels(); // relaciones específicas

  await sequelize.authenticate();
  console.log(`✅ Conectado a base remota: ${config.database}`);

  return sequelize;
};
