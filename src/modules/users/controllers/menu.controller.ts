import { Request, Response } from "express";
import { Op } from "sequelize";
import MenuModel from "../models/menu.model";
import RoleModel from "@modules/users/models/role.model";
import RoleMenuModel from "@modules/users/models/roleMenu.model";
import Joi from "joi";
import { Console } from "console";

const menuSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  path: Joi.string().max(255).allow("", null).optional(),
  icon: Joi.string().max(50).allow("", null).optional(),
  parentId: Joi.number().allow(null).optional(),
  isActive: Joi.boolean().allow(null).optional(),
  sortOrder: Joi.number().optional(),
  description: Joi.string().max(255).allow("").optional(),
});

export const getAllMenus = async (req: Request, res: Response): Promise<void> => {
  try {
    const menus = await MenuModel.findAll();
    res.status(200).json(menus);
  } catch (error) {
    console.error("❌ Error en getAllMenus:", error);
    res.status(500).json({ error: "Error al obtener los menús" });
  }
};

export const getMenuById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const menu = await MenuModel.findByPk(id);

    if (!menu) {
      res.status(404).json({ error: "Menú no encontrado" });
      return;
    }
    res.status(200).json(menu);
  } catch (error) {
    console.error("❌ Error en getMenuById:", error);
    res.status(500).json({ error: "Error al obtener el menú" });
  }
};

export const createMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = menuSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        message: "Error de validación",
        details: error.details.map((d) => d.message),
      });
      return;
    }

    const { name, parentId } = req.body;
    const existing = await MenuModel.findOne({ where: { name } });
    if (existing) {
      res.status(409).json({ error: "Ya existe un menú con ese nombre" });
      return;
    }

    const maxSortRaw = await MenuModel.max("sortOrder", {
      where: { parentId: parentId ?? null },
    });
    const maxSort = typeof maxSortRaw === "number" ? maxSortRaw : 0;

    const newMenu = await MenuModel.create({
      ...req.body,
      isActive: req.body.isActive ?? true,
      sortOrder: req.body.sortOrder ?? maxSort + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const adminRole = await RoleModel.findOne({ where: { name: "Administrador" } });
    if (adminRole) {
      await adminRole.$add("menus", newMenu);
      console.log("✅ Menú asignado al rol Administrador");
    } else {
      console.warn("⚠️ Rol Administrador no encontrado");
    }

    res.status(201).json({
      message: "Menú creado correctamente y asignado al rol Administrador",
      data: newMenu,
    });
  } catch (error) {
    console.error("❌ Error en createMenu:", error);
    res.status(500).json({ error: "Error al crear el menú" });
  }
};

export const updateMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log("🔧 [PUT /menus/:id] Actualizando menú ID:", id);
    console.log("📦 Datos recibidos:", req.body);

    // 🧹 Limpiar campos no permitidos
    const {
      name,
      path,
      icon,
      parentId,
      sortOrder,
      isActive
    } = req.body;

    const payload = {
      name,
      path,
      icon,
      parentId,
      sortOrder,
      isActive,
    };

    // ✅ Validación
    const { error } = menuSchema.validate(payload);
    if (error) {
      console.error("❌ Error de validación Joi:", error.details);
      res.status(400).json({
        message: "Error de validación",
        details: error.details.map((d) => d.message),
      });
      return;
    }

    // 🔍 Buscar menú existente
    const menu = await MenuModel.findByPk(id);
    if (!menu) {
      res.status(404).json({ error: "Menú no encontrado" });
      return;
    }

    // 🔎 Validar nombre único (excepto el mismo ID)
    if (name && name !== menu.name) {
      const existingByName = await MenuModel.findOne({
        where: {
          name,
          id: { [Op.ne]: id },
        },
      });

      if (existingByName) {
        res.status(409).json({ error: "Ya existe un menú con ese nombre" });
        return;
      }
    }

    // ✏️ Actualizar el menú
    await menu.update({
      name,
      path,
      icon,
      parentId: parentId ?? null,
      sortOrder: sortOrder ?? menu.sortOrder,
      isActive: isActive ?? menu.isActive,
      updatedAt: new Date(),
    });

    // 🔁 Recargar para obtener datos actualizados
    await menu.reload();

    console.log("✅ Menú actualizado:", menu.toJSON());

    res.status(200).json({
      message: "Menú actualizado correctamente",
      menu,
    });
  } catch (error) {
    console.error("❌ Error en updateMenu:", error);
    res.status(500).json({ error: "Error al actualizar el menú" });
  }
};


export const deleteMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const menu = await MenuModel.findByPk(id);
    if (!menu) {
      res.status(404).json({ error: "Menú no encontrado" });
      return;
    }

    await RoleMenuModel.destroy({ where: { menuId: id } });
    await menu.destroy();

    res.json({ message: "Menú eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error en deleteMenu:", error);
    res.status(500).json({ error: "Error al eliminar el menú" });
  }
};

