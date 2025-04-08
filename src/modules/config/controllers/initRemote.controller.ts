// src/modules/config/controllers/initRemote.controller.ts
import { Request, Response } from "express";
import DbConnectionModel from "@modules/config/models/dbConnection.model";
import { createDynamicSequelize } from "@modules/config/utils/createDynamicSequelize";
import { insertDefaultData } from "@modules/config/seeds/insertDefaultData";

export const initializeRemoteDatabase = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  try {
    const config = await DbConnectionModel.findByPk(id);
    if (!config) {
      res.status(404).json({ mensaje: "Conexión no encontrada" });
      return;
    }

    // 📡 Crear conexión dinámica
    const sequelize = await createDynamicSequelize({
      host: config.servidor,
      port: config.puerto,
      database: config.baseDatos,
      username: config.usuario,
      password: config.contrasena,
      ssl: config.ssl,
    });

    await sequelize.sync();

    // 🧠 Verificar existencia de modelos clave
    const Zona = sequelize.models.ZonaModel;
    const Empleado = sequelize.models.EmpleadoModel;
    const Dispositivo = sequelize.models.DispositivoModel;

    if (!Zona || !Empleado || !Dispositivo) {
      res.status(500).json({ mensaje: "Uno o más modelos no están definidos correctamente." });
      return;
    }

    const [zonaCount, empleadoCount, dispositivoCount] = await Promise.all([
      Zona.count(),
      Empleado.count(),
      Dispositivo.count(),
    ]);

    if (zonaCount > 0 || empleadoCount > 0 || dispositivoCount > 0) {
      res.status(400).json({
        mensaje: "⚠️ No se puede inicializar. La base de datos ya contiene datos.",
        detalles: {
          zonas: zonaCount,
          empleados: empleadoCount,
          dispositivos: dispositivoCount,
        },
      });
      return;
    }

    // 🧬 Construir objeto de conexión desde el modelo
    const connectionInfo = {
      servidor: config.servidor,
      puerto: config.puerto,
      baseDatos: config.baseDatos,
      usuario: config.usuario,
      contrasena: config.contrasena,
      ssl: config.ssl,
    };

    // 🌱 Insertar datos por defecto (zonas, catálogos, configBiometrica)
    await insertDefaultData(sequelize, connectionInfo);

    res.status(200).json({ mensaje: "✅ Base de datos inicializada exitosamente." });

  } catch (error) {
    console.error("❌ Error al inicializar base remota:", error);
    res.status(500).json({ mensaje: "Error al inicializar la base de datos remota." });
  }
};
