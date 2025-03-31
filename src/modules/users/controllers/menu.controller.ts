import { Request, Response } from "express";
import { Op } from "sequelize";
import MenuModel from "../models/menu.model";
import RoleModel from "@modules/users/models/role.model";

import Joi from "joi";

/** 
 * Definimos un esquema de validación para los campos de un menú.
 * Ajusta los campos según tu modelo real (path, icon, etc.). 
 * Si tu tabla de menús tiene más campos, inclúyelos aquí.
 */
const menuSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(), // El nombre es obligatorio
  path: Joi.string().max(255).allow("").optional(),
  icon: Joi.string().max(50).allow("").optional(),
  parentId: Joi.number().allow(null).optional(),
  isActive: Joi.boolean().optional(),
  sortOrder: Joi.number().optional(),
  // description, si la tienes como campo en la BD:
  description: Joi.string().max(255).allow("").optional(),
});

/**
 * GET /menus
 * Obtiene la lista de todos los menús.
 */
export const getAllMenus = async (req: Request, res: Response): Promise<void> => {
  try {
    // Podrías incluir un "order" para ordenarlos por sortOrder (si lo usas):
    // const menus = await MenuModel.findAll({
    //   order: [["sortOrder", "ASC"], ["name", "ASC"]]
    // });

    const menus = await MenuModel.findAll();
    res.status(200).json(menus);
  } catch (error) {
    console.error("❌ Error en getAllMenus:", error);
    res.status(500).json({ error: "Error al obtener los menús" });
  }
};

/**
 * GET /menus/:id
 * Obtiene un menú por su ID.
 */
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

/**
 * POST /menus
 * Crea un nuevo menú.
 */
export const createMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    // ✅ Validar entrada
    const { error } = menuSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        message: "Error de validación",
        details: error.details.map((d) => d.message),
      });
      return;
    }

    const { name } = req.body;

    // ✅ Verificar duplicado
    const existing = await MenuModel.findOne({ where: { name } });
    if (existing) {
      res.status(409).json({ error: "Ya existe un menú con ese nombre" });
      return;
    }

    // ✅ Calcular sortOrder si no viene
    const maxSortRaw = await MenuModel.max("sortOrder");
    const maxSort = typeof maxSortRaw === "number" ? maxSortRaw : 0;

    // ✅ Crear menú con sortOrder dinámico
    const newMenu = await MenuModel.create({
      ...req.body,
      sortOrder: req.body.sortOrder ?? maxSort + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // ✅ Asignar al rol "Administrador"
    const adminRole = await RoleModel.findOne({ where: { name: "Administrador" } });
    if (adminRole) {
      await adminRole.$add("menus", newMenu);
      console.log("✅ Menú asignado al rol Administrador");
    } else {
      console.warn("⚠️ Rol Administrador no encontrado");
    }

    // ✅ Enviar respuesta
    res.status(201).json({
      message: "Menú creado correctamente y asignado al rol Administrador",
      data: newMenu,
    });
  } catch (error) {
    console.error("❌ Error en createMenu:", error);
    res.status(500).json({ error: "Error al crear el menú" });
  }
};

/**
 * PUT /menus/:id
 * Actualiza un menú existente.
 */
export const updateMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validar la entrada
    const { error } = menuSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        message: "Error de validación",
        details: error.details.map((d) => d.message),
      });
      return;
    }

    // Buscar el menú
    const menu = await MenuModel.findByPk(id);
    if (!menu) {
      res.status(404).json({ error: "Menú no encontrado" });
      return;
    }

    // Evitar colisión de nombres repetidos (opcional)
    // Por ejemplo, si no quieres que haya dos menús con el mismo nombre:
    if (req.body.name && req.body.name !== menu.name) {
      const existingByName = await MenuModel.findOne({
        where: {
          name: req.body.name,
          id: { [Op.ne]: id }, // Excluir el actual
        },
      });
      if (existingByName) {
        res.status(409).json({ error: "Ya existe un menú con ese nombre" });
        return;
      }
    }

    // Actualizar los campos
    await menu.update({
      ...req.body,
      updatedAt: new Date(),
    });

    res.status(200).json({
      message: "Menú actualizado correctamente",
      menu,
    });
  } catch (error) {
    console.error("❌ Error en updateMenu:", error);
    res.status(500).json({ error: "Error al actualizar el menú" });
  }
};

/**
 * DELETE /menus/:id
 * Elimina un menú por su ID.
 */
export const deleteMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const menu = await MenuModel.findByPk(id);

    if (!menu) {
      res.status(404).json({ error: "Menú no encontrado" });
      return;
    }

    await menu.destroy();
    res.json({ message: "Menú eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error en deleteMenu:", error);
    res.status(500).json({ error: "Error al eliminar el menú" });
  }
};
