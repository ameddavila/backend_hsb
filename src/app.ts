import "module-alias/register";
import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import xssClean from "xss-clean";
import cors from "cors";
import helmet from "helmet";
import { cleanExpiredTokens } from "./scripts/cleanExpiredTokens";
import { initializeRelationships } from "@relationships/relationships";
import routes from "./routes";
import { errorMiddleware } from "@middleware/error.middleware";
import seedData from "./scripts/seedData";
import { initializeDatabase } from "./config/database";

// 🧪 Cargar variables de entorno
dotenv.config();
console.log("📢 Archivo .env cargado:");
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

// 🧪 Lista blanca de orígenes permitidos
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000", // por si el .env está mal escrito
  undefined,
];

// 🚀 Inicializa Express
const app = express();

// 🔒 Seguridad
app.use(helmet());
app.use(xssClean());
app.use(cookieParser());
app.use(express.json());

// 🌐 CORS correctamente configurado
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("🌐 Solicitud desde:", origin); // 👀 DEBUG
    
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("⛔️ CORS bloqueado para:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Rutas de la API
app.use("/api", routes);

// 🧼 Middleware de errores
app.use(errorMiddleware as express.ErrorRequestHandler);

// ⏰ Ejecutar limpieza cada 30 min
//setInterval(cleanExpiredTokens, 30 * 60 * 1000);

const forceDb = process.env.SYNC === "si";

// 🚀 Inicialización del servidor
const startServer = async () => {
  try {
    process.emitWarning = () => {}; // Silenciar advertencias

    const sequelize = await initializeDatabase();
    initializeRelationships();
    await sequelize.authenticate();

    console.log("✅ Conexión a la base de datos configurada correctamente.");
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
      console.log("⚠️ No se ejecuta el Seeder porque la sincronización fue forzada.");
    }

    app.listen(process.env.PORT, () => {
      console.log(`✅ Servidor corriendo en el puerto ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
  }
};

startServer();
