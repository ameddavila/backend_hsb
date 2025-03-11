import { Request, Response, NextFunction } from "express";
import { RequestWithUser } from "@middleware/auth.middleware"; // Importa la interfaz

export const checkPermission = (allowedRoles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.roleName) {
      console.error("🚨 Acceso denegado: Usuario no autenticado.");
      res.status(403).json({ message: "Acceso denegado: No autorizado" });
      return;
    }

    const userRole = req.user.roleName.toLowerCase();
    const allowedRolesLower = allowedRoles.map((role) => role.toLowerCase());

    console.log("🔹 Usuario:", req.user);
    console.log("🔹 Roles permitidos:", allowedRolesLower);

    if (!allowedRolesLower.includes(userRole)) {
      console.error("🚨 Permiso denegado. Rol del usuario:", userRole);
      res.status(403).json({ message: "No tienes permisos para esta acción" });
      return;
    }

    console.log("✅ Acceso permitido para el rol:", userRole);
    next();
  };
};
