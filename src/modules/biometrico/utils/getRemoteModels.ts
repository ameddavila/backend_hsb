import { Sequelize } from "sequelize-typescript";
import { createDynamicSequelize } from "@modules/config/utils/createDynamicSequelize";
import DbConnectionModel from "@modules/config/models/dbConnection.model";
import ZonaModel from "../models/zona.model";
import ConfigBiometricaModel from "../models/configBiometrica.model";
// Agrega aquí todos los modelos biométricos que usarás dinámicamente
import { associateBiometricoModels } from "@modules/biometrico/relationships/biometrico.relations";

export const getRemoteModels = async (dbConnectionId: number) => {
  const config = await DbConnectionModel.findByPk(dbConnectionId);
  if (!config) throw new Error("Configuración remota no encontrada");

  const sequelize = await createDynamicSequelize({
    host: config.servidor,
    port: config.puerto,
    database: config.baseDatos,
    username: config.usuario,
    password: config.contrasena,
    ssl: config.ssl,
  });

  // Cargar modelos biométricos
  sequelize.addModels([
    ZonaModel,
    ConfigBiometricaModel,
    // otros modelos...
  ]);

  // Asociaciones
  associateBiometricoModels(sequelize);


  // Asegúrate de sincronizar o autenticar si es necesario
  await sequelize.authenticate();

  return {
    sequelize,
    models: {
      ZonaModel: sequelize.model(ZonaModel),
      ConfigBiometricaModel: sequelize.model(ConfigBiometricaModel),
      // otros modelos...
    },
  };
};
