// src/config/initializeCentralDatabase.ts

import { Sequelize, ModelCtor, Model } from "sequelize-typescript";
import dotenv from "dotenv";
import path from "path";
import { readdirSync, existsSync } from "fs";

dotenv.config();

let sequelize: Sequelize | null = null;
const MODULES_TO_EXCLUDE = ["biometrico"]; // 🔥 este módulo se ignora

export const initializeCentralDatabase = async (): Promise<Sequelize> => {
  if (sequelize) return sequelize;

  console.log("🔧 Inicializando base de datos central (dbCENTRAL)...");

  sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "1433", 10),
    dialect: "mssql",
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
        instanceName: process.env.DB_INSTANCE,
        timezone: "Z",
      },
    },
    logging: false,
    timezone: "America/La_Paz",
  });

  const loadModels = async (dir: string): Promise<ModelCtor<Model>[]> => {
    const models: ModelCtor<Model>[] = [];
    if (!existsSync(dir)) return models;

    const files = readdirSync(dir).filter(f => f.endsWith(".model.ts") || f.endsWith(".model.js"));
    console.log(`📂 Modelos encontrados en ${dir}: ${files.length}`);

    for (const file of files) {
      const modelPath = path.join(dir, file);
      const imported = await import(modelPath);
      const model = imported.default;
      if (model && model.prototype instanceof Model) {
        models.push(model);
      } else {
        console.warn(`⚠️ ${file} no exporta un modelo válido.`);
      }
    }

    return models;
  };

  const modulesDir = path.join(__dirname, "../modules");
  const folders = readdirSync(modulesDir).filter(
    folder => !MODULES_TO_EXCLUDE.includes(folder) // ⛔️ Excluir biometrico
  );

  let allModels: ModelCtor<Model>[] = [];
  for (const folder of folders) {
    const modelDir = path.join(modulesDir, folder, "models");
    if (existsSync(modelDir)) {
      console.log(`📂 Cargando modelos para el módulo: ${folder}`);
      allModels = allModels.concat(await loadModels(modelDir));
    }
  }

  if (allModels.length > 0) {
    sequelize.addModels(allModels);
    console.log("✅ Modelos registrados en dbCENTRAL:", Object.keys(sequelize.models));
  }

  return sequelize;
};

export { sequelize };
