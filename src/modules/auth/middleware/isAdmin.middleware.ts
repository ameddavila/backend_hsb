// src/middleware/isAdmin.middleware.ts

import { RequestWithUser } from "@modules/auth/types/requestWithUser";
import { Response, NextFunction } from "express";
import { hasRole } from "@utils/hasRole";

/**
 * Middleware que permite acceso solo a usuarios con rol "Administrador"
 */
export const isAdmin = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    console.warn("🚫 Acceso denegado: usuario no autenticado.");
    return res.status(401).json({ message: "No autenticado" });
  }

  if (!hasRole(req, "Administrador")) {
    console.warn(`🚫 Acceso denegado para el rol: ${req.user.roleName}`);
    return res
      .status(403)
      .json({ message: "Acceso permitido solo para administradores" });
  }

  console.log("✅ Acceso autorizado para administrador");
  next();
};
