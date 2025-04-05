import { RequestHandler } from "express";
import { Sequelize } from "sequelize-typescript";
import DbConnectionModel from "@modules/config/models/dbConnection.model";
import { createDynamicSequelize } from "@modules/config/utils/createDynamicSequelize"; // Asumiendo que tienes esta función
import { insertDefaultData } from "@modules/config/seeds/insertDefaultData"; // Donde defines tu seeder inicial

export const initializeRemoteDatabase: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const config = await DbConnectionModel.findByPk(id);

    if (!config) {
      return res.status(404).json({ mensaje: "Conexión no encontrada" });
    }

    // 🔌 Crear conexión dinámica con Sequelize
    const sequelize = await createDynamicSequelize({
      host: config.servidor,
      port: config.puerto,
      database: config.baseDatos,
      username: config.usuario,
      password: config.contrasena,
      ssl: config.ssl,
    });

    // 🧠 Sincronizar modelos sin alterar data
    await sequelize.sync(); // cuidado: usa `.sync({ alter: true })` o `{ force: true }` sólo si es necesario

    // 🔎 Verificar si ya hay datos en las tablas clave
    const zonaCount = await sequelize.model("ZonaModel").count();
    const empleadoCount = await sequelize.model("EmpleadoModel").count();
    const dispositivoCount = await sequelize.model("DispositivoModel").count();

    if (zonaCount > 0 || empleadoCount > 0 || dispositivoCount > 0) {
      return res.status(400).json({
        mensaje: "⚠️ No se puede inicializar. La base de datos ya contiene datos.",
        detalles: {
          zonas: zonaCount,
          empleados: empleadoCount,
          dispositivos: dispositivoCount,
        },
      });
    }

    // 🌱 Insertar datos por defecto (zonas, horarios, etc.)
    await insertDefaultData(sequelize);

    return res.status(200).json({ mensaje: "✅ Base de datos inicializada exitosamente." });

  } catch (error) {
    console.error("❌ Error al inicializar base remota:", error);
    return res.status(500).json({ mensaje: "Error al inicializar la base de datos remota." });
  }
};
