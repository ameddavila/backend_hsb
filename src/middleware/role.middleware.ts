import { Request, Response, NextFunction } from "express";

export const checkRole = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !requiredRoles.includes(req.user.roleName)) {
      res.status(403).json({ error: "Acceso denegado" });
      return; // Asegúrate de salir de la función
    }
    next();
  };
};
