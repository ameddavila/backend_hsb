import { Request, Response } from "express";
import { dbConnectionSchema } from "@modules/config/schemas/dbConnection.schema";
import ConfigConexionModel from "@modules/config/models/dbConnection.model";

// 📌 Crear una conexión
export const create = async (req: Request, res: Response) => {
  const { error, value } = dbConnectionSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ mensaje: "Error de validación", errores });
  }

  try {
    // Verificar si ya existe una conexión con el mismo nombre o base de datos
    const existe = await ConfigConexionModel.findOne({
      where: {
        nombre: value.nombre,
      },
    });

    if (existe) {
      return res.status(409).json({ mensaje: "Ya existe una conexión con ese nombre." });
    }

    const nuevaConexion = await ConfigConexionModel.create(value);
    return res.status(201).json({ mensaje: "Conexión creada exitosamente.", data: nuevaConexion });

  } catch (err) {
    console.error("Error al crear conexión:", err);
    return res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

// 📌 Obtener todas las conexiones
export const getAll = async (_req: Request, res: Response) => {
  try {
    const conexiones = await ConfigConexionModel.findAll();
    return res.status(200).json({ data: conexiones });
  } catch (err) {
    console.error("Error al obtener conexiones:", err);
    return res.status(500).json({ mensaje: "Error al obtener las conexiones." });
  }
};

// 📌 Obtener una conexión por ID
export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const conexion = await ConfigConexionModel.findByPk(id);

    if (!conexion) {
      return res.status(404).json({ mensaje: "Conexión no encontrada." });
    }

    return res.status(200).json({ data: conexion });
  } catch (err) {
    console.error("Error al buscar conexión:", err);
    return res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

// 📌 Actualizar una conexión
export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { error, value } = dbConnectionSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errores = error.details.map(e => e.message);
    return res.status(400).json({ mensaje: "Error de validación", errores });
  }

  try {
    const conexion = await ConfigConexionModel.findByPk(id);
    if (!conexion) {
      return res.status(404).json({ mensaje: "Conexión no encontrada." });
    }

    // Verifica si el nombre ya está usado por otro registro
    const duplicado = await ConfigConexionModel.findOne({
      where: { nombre: value.nombre },
    });

    if (duplicado && duplicado.id !== conexion.id) {
      return res.status(409).json({ mensaje: "Ya existe una conexión con ese nombre." });
    }

    await conexion.update(value);
    return res.status(200).json({ mensaje: "Conexión actualizada correctamente.", data: conexion });
  } catch (err) {
    console.error("Error al actualizar conexión:", err);
    return res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

// 📌 Eliminar una conexión
export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const conexion = await ConfigConexionModel.findByPk(id);
    if (!conexion) {
      return res.status(404).json({ mensaje: "Conexión no encontrada." });
    }

    await conexion.destroy();
    return res.status(200).json({ mensaje: "Conexión eliminada correctamente." });
  } catch (err) {
    console.error("Error al eliminar conexión:", err);
    return res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};
