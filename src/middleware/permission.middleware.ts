import { Response, NextFunction, RequestHandler } from "express";
import { RequestWithUser } from "@modules/auth/types/requestWithUser";
import { hasRole } from "@utils/hasRole";

/**
 * Middleware que verifica si el usuario tiene uno de los roles permitidos.
 * @param allowedRoles Roles permitidos (ej: ["Administrador", "Usuario"])
 */
export const checkPermission = (allowedRoles: string[]): RequestHandler => {
  return (req: RequestWithUser, res: Response, next: NextFunction): void => {
    if (!req.user) {
      console.warn("🚫 Acceso denegado: usuario no autenticado.");
      res.status(401).json({ message: "No autenticado" });
      return;
    }

    if (!hasRole(req, allowedRoles)) {
      console.warn(`🚫 Acceso denegado. Rol actual: '${req.user?.roleName}'`);
      res.status(403).json({
        message: "No tienes permisos suficientes para acceder a esta ruta",
      });
      return;
    }

    console.log(`✅ Acceso permitido para el rol: '${req.user.roleName}'`);
    next();
  };
};
