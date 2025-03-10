import "module-alias/register"; // Habilita los alias definidos en tsconfig
import "reflect-metadata"; // Soporte para decoradores (usado por sequelize-typescript)
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import xssClean from "xss-clean";
import sequelize from "./config/database";
import cors from "cors";
import helmet from "helmet";
import { initializeRelationships } from "@relationships/relationships"; // Archivo centralizado de relaciones
import routes from "./routes"; // Rutas principales de la aplicación
import { errorMiddleware } from "@middleware/error.middleware";
import seedData from "./scripts/seedData"; // 🔥 Agregamos el Seeder aquí

// 1. Cargar variables de entorno
dotenv.config();

// 2. Crear instancia de Express
const app = express();

// 3. Configurar middlewares globales
app.use(express.json()); // Parsear JSON
app.use(cookieParser()); // Manejo de cookies
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true })); // CORS
app.use(helmet()); // Configuración de cabeceras de seguridad
app.use(xssClean()); // Limpieza de datos contra XSS
app.use("/api", routes); // Montar las rutas principales en "/api"
app.use(errorMiddleware as express.ErrorRequestHandler);

// 4. Definir si se forzará la sincronización de la DB (solo en desarrollo)
const forceDb = process.env.SYNC === "si"; // 🔥 Corrección: mejor nombre `forceDb`

// 5. Función principal para iniciar el servidor
const startServer = async () => {
  try {
    process.emitWarning = () => {}; // 🔥 Evitar advertencias de versiones de SQL Server

    // (A) Inicializa las relaciones entre modelos
    initializeRelationships();

    // (B) Autentica la conexión con la base de datos
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos configurada correctamente.");

    // (C) Sincroniza los modelos con la base de datos
    console.log(
      `🔄 Sincronizando modelos con ${
        forceDb
          ? "❌ sincronización forzada (BORRADO DE TABLAS)"
          : "✅ sincronización normal"
      }...`
    );
    await sequelize.sync({ force: forceDb }); // 🔥 Corrección: `force` en lugar de `alter`

    // (D) Si no se forzó la sincronización, ejecutar el Seeder (para no borrar datos cada vez)
    if (!forceDb) {
      console.log("🌱 Ejecutando Seeder para datos iniciales...");
      await seedData();
    } else {
      console.log(
        "⚠️ No se ejecuta el Seeder porque la sincronización fue forzada."
      );
    }

    // (E) Inicia el servidor en el puerto definido en las variables de entorno
    app.listen(process.env.PORT, () => {
      console.log(`✅ Servidor corriendo en el puerto ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
  }
};

// 6. Ejecutar la función para iniciar la aplicación
startServer();
