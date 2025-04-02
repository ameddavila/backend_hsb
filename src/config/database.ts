import { Sequelize, ModelCtor, Model } from "sequelize-typescript";
import dotenv from "dotenv";
import path from "path";
import { readdirSync, existsSync } from "fs";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

let sequelize: Sequelize | null = null; // Declaramos como `null` inicialmente

/**
 * Función para inicializar la base de datos y registrar modelos dinámicamente.
 */
export const initializeDatabase = async (): Promise<Sequelize> => {
  try {
    if (sequelize) {
      return sequelize;
    }
    console.log("🔧 Iniciando configuración de Sequelize...");

    // Crear instancia de Sequelize
    sequelize = new Sequelize({
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT as string, 10) || 1433,
      dialect: "mssql",
      dialectOptions: {
        options: {
          encrypt: false,/*sProduction,*/
          trustServerCertificate:  true,/*!isProduction,*/
          instanceName: process.env.DB_INSTANCE,
          timezone: "Z",
        },
      },
      logging: false,
      timezone: "America/La_Paz",
    });

    /**
     * Función para cargar modelos dinámicamente desde un directorio.
     * @param dir - Directorio donde se encuentran los modelos
     * @returns Array de modelos cargados
     */
    const loadModels = async (
      dir: string
    ): Promise<ModelCtor<Model<any, any>>[]> => {
      const models: ModelCtor<Model<any, any>>[] = [];
      if (!existsSync(dir)) return models;

      const files = readdirSync(dir).filter(
        (file) => file.endsWith(".model.ts") || file.endsWith(".model.js")
      );
      console.log(`📂 Modelos encontrados en ${dir}: ${files.length}`);

      for (const file of files) {
        const modelPath = path.join(dir, file);
        try {
          const importedModule = await import(modelPath);
          const model = importedModule.default;
          if (model && model.prototype instanceof Model) {
            models.push(model);
          } else {
            console.warn(`⚠️ ${file} no exporta un modelo válido.`);
          }
        } catch (error) {
          console.error(`❌ Error al cargar modelo ${file}:`, error);
        }
      }
      return models;
    };

    // Directorio base de módulos
    const modulesDir = path.join(__dirname, "../modules");
    const moduleFolders = readdirSync(modulesDir);
    let allModels: ModelCtor<Model<any, any>>[] = [];

    // Cargar modelos de cada módulo
    for (const folder of moduleFolders) {
      const modelDir = path.join(modulesDir, folder, "models");

      if (existsSync(modelDir) && readdirSync(modelDir).length > 0) {
        console.log(`📂 Cargando modelos para el módulo: ${folder}`);
        const loadedModels = await loadModels(modelDir);
        allModels = allModels.concat(loadedModels);
      } else {
        console.warn(
          `⚠️ El módulo "${folder}" no tiene modelos o la carpeta está vacía.`
        );
      }
    }

    // Registrar modelos en Sequelize
    if (allModels.length > 0) {
      sequelize.addModels(allModels);
      console.log(
        "✅ Modelos registrados en Sequelize:",
        Object.keys(sequelize.models)
      );
    } else {
      console.warn("⚠️ No se encontraron modelos para registrar en Sequelize.");
    }

    return sequelize; // Retornar la instancia de Sequelize
  } catch (error) {
    console.error("❌ Error al configurar Sequelize:", error);
    process.exit(1);
  }
};

// Exportar la instancia de Sequelize correctamente
export { sequelize };
