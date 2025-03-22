// src/modules/users/controllers/menuAccess.controller.ts

import { Request, Response } from "express";
import UserModel from "@modules/users/models/user.model";
import RoleModel from "@modules/users/models/role.model";
import MenuModel from "@modules/users/models/menu.model";

interface MenuNode extends MenuModel {
  children?: MenuNode[];
}

/**
 * buildMenuTree
 * - Reconstruye la jerarquía padre-hijo.
 */
function buildMenuTree(menus: MenuModel[]): MenuNode[] {
  // Diccionario para mapear id -> objeto con children vacíos
  const map: Record<number, MenuNode> = {};

  // 1. Inicializar cada menú en el diccionario
  menus.forEach((menu) => {
    const plainMenu = menu.toJSON ? menu.toJSON() : menu;
    map[plainMenu.id] = { ...plainMenu, children: [] };
  });

  // 2. Armar la estructura
  const roots: MenuNode[] = [];

  menus.forEach((menu) => {
    const plainMenu = menu.toJSON ? menu.toJSON() : menu;
    const currentNode = map[plainMenu.id];
    if (!currentNode) {
      // Si no existe, salimos
      return;
    }

    if (plainMenu.parentId == null) {
      // Es raíz
      roots.push(currentNode);
    } else {
      // Tiene padre, lo metemos en children del padre
      const parentNode = map[plainMenu.parentId];
      if (parentNode) {
        parentNode.children!.push(currentNode);
      }
      // Si no existe parentNode, simplemente se ignora
    }
  });

  return roots;
}

/**
 * getUserMenus
 */
export const getUserMenus = async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // 1. Buscar usuario y sus roles
    const user = await UserModel.findByPk(req.user.userId, {
      include: [RoleModel],
    });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    let allMenus: MenuModel[] = [];
    for (const role of user.roles || []) {
      // Ahora TS sabe que role.getMenus() sí existe
      const roleMenus = await role.getMenus();
      allMenus.push(...roleMenus);
    }

    // 2. Eliminar duplicados
    const uniqueMap: Record<number, MenuModel> = {};
    allMenus.forEach((m) => {
      uniqueMap[m.id] = m;
    });
    const uniqueMenus = Object.values(uniqueMap);

    // 3. Crear la jerarquía
    const tree = buildMenuTree(uniqueMenus);

    return res.json(tree);
  } catch (error) {
    console.error("Error en getUserMenus:", error);
    return res.status(500).json({ error: "Error interno al obtener menús" });
  }
};
