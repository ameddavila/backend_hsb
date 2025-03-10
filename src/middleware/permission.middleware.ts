import { Request, Response, NextFunction } from "express";

/**
 * Middleware para verificar permisos del usuario.
 * @param requiredPermissions - Lista de roles con acceso permitido.
 */
export const checkPermission = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.roleName) {
      res.status(403).json({ error: "Acceso denegado" });
      return;
    }

    if (!requiredPermissions.includes(req.user.roleName)) {
      res.status(403).json({ error: "No tienes permisos para acceder" });
      return;
    }

    next();
  };
};
