// ✅ src/modules/biometrico/controllers/zona.controller.ts
import { Request, Response } from "express";
import { zonaSchema } from "../validators/zona.validator";
import {
  crearZona,
  obtenerZonas,
  obtenerZonaPorId,
  actualizarZona,
  eliminarZona,
} from "../services/zona.service";

// 🔹 Crear zona
export const crearZonaController = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = zonaSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0]?.message });
    return;
  }

  try {
    const nuevaZona = await crearZona(value, req);
    res.status(201).json(nuevaZona);
  } catch (err: any) {
    console.error("❌ Error al crear zona:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// 🔹 Obtener todas las zonas
export const obtenerZonasController = async (req: Request, res: Response): Promise<void> => {
  try {
    const zonas = await obtenerZonas(req);
    res.json(zonas);
  } catch (err) {
    console.error("❌ Error al obtener zonas:", err);
    res.status(500).json({ error: "Error al obtener zonas" });
  }
};

// 🔹 Obtener zona por ID
export const getZonaById = async (req: Request, res: Response): Promise<void> => {
  const zonaId = Number(req.params.id);

  try {
    const zona = await obtenerZonaPorId(zonaId, req);
    if (!zona) {
      res.status(404).json({ error: "Zona no encontrada" });
      return;
    }

    res.json(zona);
  } catch (err) {
    console.error("❌ Error al obtener zona:", err);
    res.status(500).json({ error: "Error al obtener zona" });
  }
};

// 🔹 Actualizar zona
export const updateZona = async (req: Request, res: Response): Promise<void> => {
  const zonaId = Number(req.params.id);
  const { error, value } = zonaSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0]?.message });
    return;
  }

  try {
    const zonaActualizada = await actualizarZona(zonaId, value, req);
    if (!zonaActualizada) {
      res.status(404).json({ error: "Zona no encontrada" });
      return;
    }

    res.json(zonaActualizada);
  } catch (err: any) {
    console.error("❌ Error al actualizar zona:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// 🔹 Eliminar zona
export const deleteZona = async (req: Request, res: Response): Promise<void> => {
  const zonaId = Number(req.params.id);

  try {
    const eliminada = await eliminarZona(zonaId, req);
    if (!eliminada) {
      res.status(404).json({ error: "Zona no encontrada o ya eliminada" });
      return;
    }

    res.json({ mensaje: "✅ Zona eliminada correctamente" });
  } catch (err) {
    console.error("❌ Error al eliminar zona:", err);
    res.status(500).json({ error: "Error al eliminar zona" });
  }
};
