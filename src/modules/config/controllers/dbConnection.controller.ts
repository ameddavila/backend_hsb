// src/modules/config/controllers/dbConnection.controller.ts
import { RequestHandler } from "express";
import { createDynamicSequelize } from "@modules/config/utils/createDynamicSequelize";
import DbConnectionModel from "../models/dbConnection.model";
import { insertDefaultData } from "@modules/config/seeds/insertDefaultData"


// ✅ Crear una nueva conexión
export const create: RequestHandler = async (req, res) => {
  const { error, value } = dbConnectionSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errores = error.details.map((e) => e.message);
    res.status(400).json({ mensaje: "Error de validación", errores });
    return;
  }

  try {
    const existente = await DbConnectionModel.findOne({
      where: { nombre: value.nombre },
    });

    if (existente) {
      res.status(409).json({ mensaje: "Ya existe una conexión con ese nombre." });
      return;
    }

    const nuevaConexion = await DbConnectionModel.create(value);
    res.status(201).json({ mensaje: "Conexión creada exitosamente.", data: nuevaConexion });
  } catch (err) {
    console.error("❌ Error al crear conexión:", err);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

// ✅ Obtener todas las conexiones
export const getAll: RequestHandler = async (_req, res) => {
  try {
    const conexiones = await DbConnectionModel.findAll({ order: [["id", "ASC"]] });
    res.status(200).json({ data: conexiones });
  } catch (err) {
    console.error("❌ Error al obtener conexiones:", err);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

// ✅ Obtener una conexión por ID
export const getById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const conexion = await DbConnectionModel.findByPk(id);

    if (!conexion) {
      res.status(404).json({ mensaje: "Conexión no encontrada." });
      return;
    }

    res.status(200).json({ data: conexion });
  } catch (err) {
    console.error("❌ Error al buscar conexión:", err);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

// ✅ Actualizar una conexión
export const update: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { error, value } = dbConnectionSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errores = error.details.map((e) => e.message);
    res.status(400).json({ mensaje: "Error de validación", errores });
    return;
  }

  try {
    const conexion = await DbConnectionModel.findByPk(id);
    if (!conexion) {
      res.status(404).json({ mensaje: "Conexión no encontrada." });
      return;
    }

    const duplicado = await DbConnectionModel.findOne({
      where: { nombre: value.nombre },
    });

    if (duplicado && duplicado.id !== conexion.id) {
      res.status(409).json({ mensaje: "Ya existe otra conexión con ese nombre." });
      return;
    }

    await conexion.update(value);
    res.status(200).json({ mensaje: "Conexión actualizada correctamente.", data: conexion });
  } catch (err) {
    console.error("❌ Error al actualizar conexión:", err);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

// ✅ Eliminar una conexión
export const remove: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const conexion = await DbConnectionModel.findByPk(id);
    if (!conexion) {
      res.status(404).json({ mensaje: "Conexión no encontrada." });
      return;
    }

    await conexion.destroy();
    res.status(200).json({ mensaje: "Conexión eliminada correctamente." });
  } catch (err) {
    console.error("❌ Error al eliminar conexión:", err);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};
