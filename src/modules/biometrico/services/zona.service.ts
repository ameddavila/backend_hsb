import { Op } from "sequelize";
import { getRemoteModels } from "../utils/getRemoteModels";
import type { ZonaInput } from "@modules/biometrico/types/zona";
import type { Model } from "sequelize";
import type { Request } from "express";


/** 🔹 Obtener dbConnectionId desde cabecera */
const getConnectionIdFromRequest = (req: any): number => {
  const id = Number(req.headers["x-db-connection-id"]);
  if (!id || isNaN(id)) throw new Error("ID de conexión inválido o no proporcionado en 'x-db-connection-id'");
  return id;
};

/** 🔹 Crear zona */
export const crearZona = async (data: ZonaInput, req: any) => {
  const dbConnectionId = getConnectionIdFromRequest(req);
  const { models } = await getRemoteModels(dbConnectionId);
  const ZonaModel = models.ZonaModel;

  const existente = await ZonaModel.findOne({ where: { nombre: data.nombre } });
  if (existente) {
    throw new Error(`Ya existe una zona con el nombre '${data.nombre}'`);
  }

  const nuevaZona = ZonaModel.build(data as any);
  await nuevaZona.save();
  return nuevaZona;
};

/** 🔹 Obtener todas las zonas */
export const obtenerZonas = async (req: any) => {
  const dbConnectionId = getConnectionIdFromRequest(req);
  const { models } = await getRemoteModels(dbConnectionId);
  const { ZonaModel, ConfigBiometricaModel } = models;

  return await ZonaModel.findAll({
    include: [{ model: ConfigBiometricaModel, as: "configBiometrica" }],
    order: [["zonaId", "ASC"]],
  });
};

/** 🔹 Obtener zona por ID */
export const obtenerZonaPorId = async (zonaId: number, req: any) => {
  const dbConnectionId = getConnectionIdFromRequest(req);
  const { models } = await getRemoteModels(dbConnectionId);
  const { ZonaModel, ConfigBiometricaModel } = models;

  return await ZonaModel.findByPk(zonaId, {
    include: [{ model: ConfigBiometricaModel, as: "configBiometrica" }],
  });
};

/** 🔹 Actualizar zona */
export const actualizarZona = async (zonaId: number, data: ZonaInput, req: any) => {
  const dbConnectionId = getConnectionIdFromRequest(req);
  const { models } = await getRemoteModels(dbConnectionId);
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
export const eliminarZona = async (zonaId: number, req: any) => {
  const dbConnectionId = getConnectionIdFromRequest(req);
  const { models } = await getRemoteModels(dbConnectionId);
  const ZonaModel = models.ZonaModel;

  const zona = await ZonaModel.findByPk(zonaId);
  if (!zona) return false;

  await zona.destroy();
  return true;
};
