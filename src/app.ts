import "module-alias/register"; // Habilita los alias definidos en tsconfig
import "reflect-metadata"; // Soporte para decoradores (usado por sequelize-typescript)
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import xssClean from "xss-clean";
import cors from "cors";
import helmet from "helmet";
import { initializeRelationships } from "@relationships/relationships"; // Archivo centralizado de relaciones
import routes from "./routes"; // Rutas principales de la aplicación
import { errorMiddleware } from "@middleware/error.middleware";
import seedData from "./scripts/seedData"; // 🔥 Agregamos el Seeder aquí
import { initializeDatabase } from "./config/database"; // Importar la función de inicialización

dotenv.config();

const app = express();

// 3. Configurar middlewares globales
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(helmet());
app.use(xssClean());
app.use("/api", routes);
app.use(errorMiddleware as express.ErrorRequestHandler);

const forceDb = process.env.SYNC === "si";

const startServer = async () => {
  try {
    process.emitWarning = () => {}; // 🔥 Evitar advertencias de versiones de SQL Server

    // (A) Inicializar base de datos y obtener instancia de sequelize
    const sequelize = await initializeDatabase(); // Asegurar inicialización
    initializeRelationships();

    // (B) Autenticar conexión
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos configurada correctamente.");

    // (C) Sincronizar modelos
    console.log(
      `🔄 Sincronizando modelos con ${
        forceDb
          ? "❌ sincronización forzada (BORRADO DE TABLAS)"
          : "✅ sincronización normal"
      }...`
    );
    await sequelize.sync({ force: forceDb });

    if (!forceDb) {
      console.log("🌱 Ejecutando Seeder para datos iniciales...");
      await seedData();
    } else {
      console.log(
        "⚠️ No se ejecuta el Seeder porque la sincronización fue forzada."
      );
    }

    app.listen(process.env.PORT, () => {
      console.log(`✅ Servidor corriendo en el puerto ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
  }
};

startServer();
