import { Request, Response } from "express";
import PermissionModel from "../models/permission.model";

export const getAllPermissions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const permissions = await PermissionModel.findAll();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los permisos" });
  }
};

export const createPermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;
    const permission = await PermissionModel.create({ name, description });
    res.status(201).json(permission);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el permiso" });
  }
};

export const deletePermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const permission = await PermissionModel.findByPk(req.params.id);

    if (!permission) {
      res.status(404).json({ error: "Permiso no encontrado" });
      return;
    }

    await permission.destroy();
    res.json({ message: "Permiso eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el permiso" });
  }
};
export const getPermissionById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const permission = await PermissionModel.findByPk(req.params.id);
    if (!permission) {
      res.status(404).json({ error: "Permiso no encontrado" });
      return;
    }
    res.json(permission);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el permiso" });
  }
};
