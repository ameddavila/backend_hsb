import { Request, Response, NextFunction } from "express";

export const checkPermission = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.roleName) {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    const { roleName } = (req as any).user;

    if (!requiredPermissions.includes(roleName)) {
      res.status(403).json({ error: "No tienes permisos para acceder" });
      return;
    }

    next();
  };
};
