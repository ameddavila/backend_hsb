import { Sequelize, ModelCtor, Model } from "sequelize-typescript";
import dotenv from "dotenv";
import path from "path";
import { readdirSync, existsSync } from "fs";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

let sequelize: Sequelize;

try {
  console.log("🔧 Iniciando configuración de Sequelize...");

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
    logging: false,
    timezone: "America/La_Paz",
  });

  // Función para cargar modelos dinámicamente
  const loadModels = (
    sequelize: Sequelize,
    dir: string
  ): ModelCtor<Model<any, any>>[] => {
    const models: ModelCtor<Model<any, any>>[] = [];

    try {
      const files = readdirSync(dir);
      console.log(`🔍 Buscando modelos en: ${dir}`);

      files.forEach((file) => {
        if (file.endsWith(".model.ts") || file.endsWith(".model.js")) {
          const modelPath = path.join(dir, file);
          const model = require(modelPath).default;

          if (model && model.prototype instanceof Model) {
            models.push(model);
            console.log(`📂 Modelo cargado: ${file}`);
          } else {
            console.warn(
              `⚠️ [database.ts] El archivo ${file} no exporta un modelo válido.`
            );
          }
        }
      });
    } catch (err) {
      console.warn(
        `⚠️ [database.ts] No se pudo leer el directorio ${dir}:`,
        err
      );
    }

    return models;
  };

  // Cargar y registrar modelos
  const modulesDir = path.join(__dirname, "../modules");
  const moduleFolders = readdirSync(modulesDir);
  const models: ModelCtor<Model<any, any>>[] = [];

  moduleFolders.forEach((folder) => {
    const modelDir = path.join(modulesDir, folder, "models");

    // Verificar si la carpeta 'models' existe y tiene archivos
    if (existsSync(modelDir)) {
      if (readdirSync(modelDir).length > 0) {
        console.log(`📂 Cargando modelos para el módulo: ${folder}`);
        models.push(...loadModels(sequelize, modelDir));
      } else {
        console.warn(
          `⚠️ El módulo "${folder}" tiene la carpeta 'models' pero está vacía.`
        );
      }
    } else {
      console.warn(`⚠️ El módulo "${folder}" no tiene la carpeta 'models'.`);
    }
  });

  sequelize.addModels(models);

  console.log(
    "✅ Modelos registrados en Sequelize:",
    Object.keys(sequelize.models)
  );
} catch (error) {
  console.error("❌ Error al configurar Sequelize:", error);
  process.exit(1);
}

export default sequelize;
