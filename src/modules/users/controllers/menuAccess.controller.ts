import { Response } from "express";
import { RequestWithUser } from "@middleware/auth.middleware";
import UserModel from "@modules/users/models/user.model";
import RoleModel from "@modules/users/models/role.model";
import MenuModel from "@modules/users/models/menu.model";

interface MenuNode {
  id: number;
  name: string;
  path: string;
  parentId: number | null;
  icon?: string;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
  children: MenuNode[];
}

function buildMenuTree(menus: MenuNode[]): MenuNode[] {
  const map: Record<number, MenuNode> = {};
  const roots: MenuNode[] = [];

  menus.forEach((m) => {
    map[m.id] = { ...m, children: [] };
  });

  menus.forEach((m) => {
    const currentNode = map[m.id];
    if (m.parentId === null) {
      if (currentNode) roots.push(currentNode);
    } else {
      const parentNode = map[m.parentId];
      if (parentNode && currentNode) {
        parentNode.children.push(currentNode);
      }
    }
  });

  return roots;
}

export const getUserMenus = async (
  req: RequestWithUser,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      console.warn("🔒 Usuario no autenticado");
      res.status(401).json({ error: "Usuario no autenticado" });
      return;
    }

    console.log("🔍 Buscando usuario y roles para ID:", req.user.userId);
    const user = await UserModel.findByPk(req.user.userId, {
      include: [{ model: RoleModel, as: "roles" }],
    });

    if (!user) {
      console.warn("⚠️ Usuario no encontrado");
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    let allMenus: MenuModel[] = [];
    for (const role of user.roles || []) {
      const roleMenus = await role.getMenus();
      allMenus.push(...roleMenus);
    }

    console.log(`📦 Menús obtenidos desde roles: ${allMenus.length}`);

    const uniqueMap: Record<number, MenuModel> = {};
    for (const menu of allMenus) {
      uniqueMap[menu.id] = menu;
    }
    const uniqueMenus = Object.values(uniqueMap);
    console.log(`✅ Menús únicos después de eliminar duplicados: ${uniqueMenus.length}`);

    const plainMenus: MenuNode[] = uniqueMenus.map((menu) => {
      const m = menu.toJSON ? menu.toJSON() : menu;
      return {
        id: m.id,
        name: m.name,
        path: m.path,
        parentId: m.parentId ?? null,
        icon: m.icon,
        isActive: m.isActive,
        sortOrder: m.sortOrder,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        children: [],
      };
    });

    const tree = buildMenuTree(plainMenus);
    console.log("🌳 Árbol de menús construido con", tree.length, "raíces");

    res.json(tree);
  } catch (error) {
    console.error("❌ Error en getUserMenus:", error);
    res.status(500).json({ error: "Error interno al obtener menús" });
  }
};
