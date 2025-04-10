import { Sequelize } from "sequelize-typescript";
import DbConnectionModel from "@modules/config/models/dbConnection.model";
import { createDynamicSequelize } from "@modules/config/utils/createDynamicSequelize";
import { associateBiometricoModels } from "@modules/biometrico/relationships/biometrico.relations";
import ZonaModel from "@modules/biometrico/models/zona.model";
import ConfigBiometricaModel from "@modules/biometrico/models/configBiometrica.model";

export const getRemoteModels = async (dbConnectionId: number) => {
  console.log("🔍 [getRemoteModels] Buscando configuración remota con ID:", dbConnectionId);

  const config = await DbConnectionModel.findByPk(dbConnectionId);

  if (!config) {
    console.error("❌ Configuración remota no encontrada con ID:", dbConnectionId);
    throw new Error("Configuración remota no encontrada");
  }

  console.log("✅ Configuración encontrada:", {
    nombre: config.nombre,
    servidor: config.servidor,
    baseDatos: config.baseDatos,
    usuario: config.usuario,
    puerto: config.puerto,
    ssl: config.ssl,
  });

  // Crear instancia dinámica de Sequelize
  const sequelize = await createDynamicSequelize({
    host: config.servidor,
    port: config.puerto,
    database: config.baseDatos,
    username: config.usuario,
    password: config.contrasena,
    ssl: config.ssl,
  });

  console.log("🔌 Conexión Sequelize dinámica creada");

  // Agregar modelos biométricos
  sequelize.addModels([
    ZonaModel,
    ConfigBiometricaModel,
    // otros modelos si los tienes
  ]);

  console.log("📦 Modelos biométricos cargados");

  // Establecer relaciones
  associateBiometricoModels(sequelize);
  console.log("🔗 Relaciones establecidas");

  // Autenticación para verificar conexión
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión remota autenticada correctamente");
  } catch (err) {
    console.error("❌ Error al autenticar con la base remota:", err);
    throw new Error("No se pudo autenticar con la base de datos remota");
  }

  return {
    sequelize,
    models: {
      ZonaModel: sequelize.model(ZonaModel),
      ConfigBiometricaModel: sequelize.model(ConfigBiometricaModel),
      // otros modelos si los defines aquí
    },
  };
};
