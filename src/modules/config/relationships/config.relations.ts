import { Sequelize } from "sequelize-typescript";
import ConfigBiometricaModel from "@modules/biometrico/models/configBiometrica.model";
import DbConnectionModel from "@modules/config/models/dbConnection.model";

/**
 * Establece las relaciones entre modelos del módulo de configuración.
 * Este archivo solo se debe usar cuando estás trabajando sobre la base central (bdCENTRAL).
 */
export const associateConfigModels = (sequelize: Sequelize) => {
  // Relación: config_biometrica.dbConnectionId → config_connections.id
  ConfigBiometricaModel.belongsTo(DbConnectionModel, {
    foreignKey: "dbConnectionId",
    as: "dbConnection",
  });

  DbConnectionModel.hasMany(ConfigBiometricaModel, {
    foreignKey: "dbConnectionId",
    as: "configuracionesBiometricas",
  });

  console.log("🔗 Relaciones de configuración establecidas");
};
