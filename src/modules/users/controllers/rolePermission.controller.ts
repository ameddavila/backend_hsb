import { Request, Response } from "express";
import RolePermissionModel from "../models/rolePermission.model";

export const getRolePermissionById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rolePermission = await RolePermissionModel.findByPk(req.params.id);
    if (!rolePermission) {
      res.status(404).json({ error: "Relación rol-permiso no encontrada" });
      return;
    }
    res.json(rolePermission);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la relación rol-permiso" });
  }
};
