import "module-alias/register"; // Registrar alias
import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import xssClean from "xss-clean";
import sequelize from "./config/database";
import cors from "cors";
import helmet from "helmet";
import { initializeRelationships } from "./relationships/relationships"; // Alias para config/relationships
import routes from "./routes"; // Alias para módulos
import { errorMiddleware } from "./middleware/error.middleware";

dotenv.config();

const app = express();

// Middlewares globales
app.use(express.json());
app.use(cookieParser()); // Inicializar cookie-parser
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(helmet());
app.use(xssClean());
app.use("/api", routes);
app.use(errorMiddleware);
// Registrar rutas protegidas

// Verifica si el entorno es desarrollo
const forceBb = process.env.SYNC === "si";

const startServer = async () => {
  try {
    // Conecta a la base de datos
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos configurada correctamente.");

    // Sincroniza los modelos con la base de datos
    console.log(
      `Sincronizando modelos con ${
        forceBb ? "❌ sincronización forzada" : "✅ sincronización normal"
      }...`
    );
    await sequelize.sync({ alter: forceBb }); // Forzar sincronización solo en desarrollo

    // Inicializa las relaciones entre modelos
    initializeRelationships();

    // Inicia el servidor
    app.listen(process.env.PORT, () => {
      console.log(`✅ Servidor corriendo en el puerto ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
};

startServer();
