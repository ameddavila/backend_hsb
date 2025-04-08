// src/middleware/permission.middleware.ts
import { Response, NextFunction, RequestHandler } from "express";
import { RequestWithUser } from "@modules/auth/types/requestWithUser";
import { hasRole } from "@utils/hasRole";

/**
 * Middleware que verifica si el usuario tiene uno de los roles permitidos.
 * Requiere que `req.user` esté definido por `authMiddleware`.
 */
export const checkPermission = (allowedRoles: string[]): RequestHandler => {
  return (req: RequestWithUser, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      console.warn("🚫 Acceso denegado: usuario no autenticado.");
      res.status(401).json({ message: "No autenticado" });
      return;
    }

    if (!user.roleName) {
      console.warn("🚫 Usuario autenticado pero sin rol asignado.");
      res.status(403).json({ message: "Rol no definido" });
      return;
    }

    if (!hasRole(req, allowedRoles)) {
      console.warn(`🚫 Rol no autorizado: '${user.roleName}'`);
      res.status(403).json({
        message: "No tienes permisos suficientes para acceder a esta ruta",
      });
      return;
    }

    console.log(`✅ Acceso permitido para el rol: '${user.roleName}'`);
    next();
  };
};
