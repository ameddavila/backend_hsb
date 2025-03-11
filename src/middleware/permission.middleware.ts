import { RequestHandler } from "express";
import { RequestWithUser } from "@middleware/auth.middleware";

export const checkPermission = (allowedRoles: string[]): RequestHandler => {
  return (req, res, next) => {
    if (!req.user || !req.user.roleName) {
      return res
        .status(403)
        .json({ message: "Acceso denegado: No autorizado" });
    }

    const userRole = req.user.roleName.toLowerCase();
    const allowedRolesLower = allowedRoles.map((role) => role.toLowerCase());

    if (!allowedRolesLower.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para esta acción" });
    }

    next();
  };
};
