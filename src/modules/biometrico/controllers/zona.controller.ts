import { RequestHandler } from "express";
import { zonaSchema } from "../validators/zona.validator";
import {
  crearZona,
  obtenerZonas,
  obtenerZonaPorId,
  actualizarZona,
  eliminarZona,
} from "../services/zona.service";

// 🔹 Crear zona
export const crearZonaController: RequestHandler = async (req, res) => {
  const { error, value } = zonaSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0]?.message });
    return;
  }

  try {
    const nuevaZona = await crearZona(value);
    res.status(201).json(nuevaZona);
  } catch (err: any) {
    console.error("❌ Error al crear zona:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// 🔹 Obtener todas las zonas
export const obtenerZonasController: RequestHandler = async (req, res) => {
  try {
    console.log("ENTRA AMED");
    const zonas = await obtenerZonas();
    res.json(zonas);
  } catch (err) {
    console.error("❌ Error al obtener zonas:", err);
    res.status(500).json({ error: "Error al obtener zonas" });
  }
};

// 🔹 Obtener zona por ID
export const getZonaById: RequestHandler = async (req, res) => {
  const zonaId = Number(req.params.id);

  try {
    const zona = await obtenerZonaPorId(zonaId);
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
export const updateZona: RequestHandler = async (req, res) => {
  const zonaId = Number(req.params.id);
  const { error, value } = zonaSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0]?.message });
    return;
  }

  try {
    const zonaActualizada = await actualizarZona(zonaId, value);
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
export const deleteZona: RequestHandler = async (req, res) => {
  const zonaId = Number(req.params.id);

  try {
    const eliminada = await eliminarZona(zonaId);
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
