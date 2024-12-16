import { Request, Response } from "express";
import RoleMenuModel from "../models/roleMenu.model";

export const getRoleMenuById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roleMenu = await RoleMenuModel.findByPk(req.params.id);
    if (!roleMenu) {
      res.status(404).json({ error: "Relación rol-menú no encontrada" });
      return;
    }
    res.json(roleMenu);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la relación rol-menú" });
  }
};
