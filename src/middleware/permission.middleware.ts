import { Request, Response, NextFunction } from "express";

export const checkPermission = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.roleName || "")) {
      return res.status(403).json({ message: "No tienes permisos" });
    }
    next();
  };
};
