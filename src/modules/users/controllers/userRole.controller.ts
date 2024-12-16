import { Request, Response } from "express";
import UserRoleModel from "../models/userRole.model";

export const getUserRoleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userRole = await UserRoleModel.findByPk(req.params.id);
    if (!userRole) {
      res.status(404).json({ error: "Relación usuario-rol no encontrada" });
      return;
    }
    res.json(userRole);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la relación usuario-rol" });
  }
};
