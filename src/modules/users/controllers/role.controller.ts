import { Request, Response } from "express";
import RoleModel from "../models/role.model";
import PermissionModel from "../models/permission.model";

export const getRoleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const role = await RoleModel.findByPk(req.params.id, {
      include: [{ model: PermissionModel, as: "permissions" }],
    });
    if (!role) {
      res.status(404).json({ error: "Rol no encontrado" });
      return;
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el rol" });
  }
};

export const updateRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, permissions } = req.body;
    const role = await RoleModel.findByPk(req.params.id);

    if (!role) {
      res.status(404).json({ error: "Rol no encontrado" });
      return;
    }

    // Actualizar el nombre del rol
    if (name) {
      await role.update({ name });
    }

    // Actualizar permisos asociados
    if (permissions && Array.isArray(permissions)) {
      await role.$set("permissions" as keyof typeof role, permissions); // Forzar el tipo del alias
    }

    // Recuperar el rol actualizado con los permisos
    const updatedRole = await RoleModel.findByPk(req.params.id, {
      include: [{ model: PermissionModel, as: "permissions" }],
    });

    res.json(updatedRole);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el rol" });
  }
};

export const deleteRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const role = await RoleModel.findByPk(req.params.id);

    if (!role) {
      res.status(404).json({ error: "Rol no encontrado" });
      return;
    }

    await role.destroy();
    res.json({ message: "Rol eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el rol" });
  }
};
