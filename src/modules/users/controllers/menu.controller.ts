import { Request, Response } from "express";
import MenuModel from "../models/menu.model";

export const getAllMenus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const menus = await MenuModel.findAll();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los menús" });
  }
};

export const createMenu = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;
    const menu = await MenuModel.create({ name, description });
    res.status(201).json(menu);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el menú" });
  }
};

export const deleteMenu = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const menu = await MenuModel.findByPk(req.params.id);

    if (!menu) {
      res.status(404).json({ error: "Menú no encontrado" });
      return;
    }
    await menu.destroy();
    res.json({ message: "Menú eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el menú" });
  }
};
export const getMenuById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const menu = await MenuModel.findByPk(req.params.id);
    if (!menu) {
      res.status(404).json({ error: "Menú no encontrado" });
      return;
    }
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el menú" });
  }
};
