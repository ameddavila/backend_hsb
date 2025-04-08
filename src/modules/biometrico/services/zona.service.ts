// src/modules/biometrico/services/zona.service.ts
import { Op } from "sequelize";
import { getRemoteModels } from "../utils/getRemoteModels";
import type { ZonaInput } from "../../../types/zona";
import type { Model } from "sequelize";

const DEFAULT_DB_CONNECTION_ID = 3;

/** 🔹 Crear zona */
export const crearZona = async (data: ZonaInput) => {
  const { models } = await getRemoteModels(DEFAULT_DB_CONNECTION_ID);
  const ZonaModel = models.ZonaModel;

  const existente = await ZonaModel.findOne({ where: { nombre: data.nombre } });
  if (existente) {
    throw new Error(`Ya existe una zona con el nombre '${data.nombre}'`);
  }

  const nuevaZona = ZonaModel.build(data as unknown as Record<string, any>); // No necesitas tipar extra aquí
  await nuevaZona.save();
  return nuevaZona;
};

/** 🔹 Obtener todas las zonas */
export const obtenerZonas = async () => {
  const { models } = await getRemoteModels(DEFAULT_DB_CONNECTION_ID);
  const { ZonaModel, ConfigBiometricaModel } = models;

  return await ZonaModel.findAll({
    include: [{ model: ConfigBiometricaModel, as: "configBiometrica" }],
    order: [["zonaId", "ASC"]],
  });
};

/** 🔹 Obtener zona por ID */
export const obtenerZonaPorId = async (zonaId: number) => {
  const { models } = await getRemoteModels(DEFAULT_DB_CONNECTION_ID);
  const { ZonaModel, ConfigBiometricaModel } = models;

  return await ZonaModel.findByPk(zonaId, {
    include: [{ model: ConfigBiometricaModel, as: "configBiometrica" }],
  });
};

/** 🔹 Actualizar zona */
export const actualizarZona = async (zonaId: number, data: ZonaInput) => {
  const { models } = await getRemoteModels(DEFAULT_DB_CONNECTION_ID);
  const ZonaModel = models.ZonaModel;

  const zona = await ZonaModel.findByPk(zonaId) as Model | null;
  if (!zona) return null;

  const currentNombre = zona.getDataValue("nombre");
  if (data.nombre && data.nombre !== currentNombre) {
    const duplicada = await ZonaModel.findOne({
      where: {
        nombre: data.nombre,
        zonaId: { [Op.ne]: zonaId },
      },
    });

    if (duplicada) {
      throw new Error(`Ya existe otra zona con el nombre '${data.nombre}'`);
    }
  }

  await zona.update(data);
  return zona;
};

/** 🔹 Eliminar zona */
export const eliminarZona = async (zonaId: number) => {
  const { models } = await getRemoteModels(DEFAULT_DB_CONNECTION_ID);
  const ZonaModel = models.ZonaModel;

  const zona = await ZonaModel.findByPk(zonaId);
  if (!zona) return false;

  await zona.destroy();
  return true;
};
