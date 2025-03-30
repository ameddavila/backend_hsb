// src/middleware/permission.middleware.ts
import { Response, NextFunction } from "express";
import { RequestWithUser } from "@modules/auth/types/requestWithUser";
import { hasRole } from "@utils/hasRole";

/**
 * Middleware que verifica si el usuario autenticado tiene uno de los roles permitidos.
 * @param allowedRoles Roles permitidos (ej: ["Administrador", "Usuario"])
 */
export const checkPermission = (allowedRoles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      console.warn("🚫 Acceso denegado: usuario no autenticado.");
      return res.status(401).json({ message: "No autenticado" });
    }

    if (!hasRole(req, allowedRoles)) {
      console.warn(`🚫 Acceso denegado. Rol actual: '${req.user?.roleName}'`);
      return res.status(403).json({
        message: "No tienes permisos suficientes para acceder a esta ruta",
      });
    }

    console.log(`✅ Acceso permitido para el rol: '${req.user.roleName}'`);
    next();
  };
};
