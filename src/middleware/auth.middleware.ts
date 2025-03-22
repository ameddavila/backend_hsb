// src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Interfaz local: Extiende `express.Request` con la propiedad `user`
 */
export interface RequestWithUser extends Request {
  user?: {
    userId: string;
    roleId?: number;
    roleName?: string;
  };
}

/**
 * Middleware de autenticación
 * - Extrae el token JWT (desde header o cookie)
 * - Verifica y decodifica
 * - Asigna `req.user`
 */
export const authMiddleware = (
  req: RequestWithUser, // <= Usamos la interfaz local en la firma
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      message: "No autorizado: Falta o formato incorrecto del token",
    });
    return;
  }

  const token = authHeader.split(" ")[1]; // O req.cookies.accessToken, etc.

  if (!token) {
    res.status(401).json({ message: "Token inválido o vacío" });
    return ;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload & {
      userId: string;
      roleId?: number;
      roleName?: string;
    };

    if (!decoded.userId) {
      res.status(401).json({ message: "Token inválido: Falta userId" });
      return ;
    }

    // Asignamos la info al `req.user`
    req.user = {
      userId: decoded.userId,
      roleId: decoded.roleId,
      roleName: decoded.roleName,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
    return;
  }
};
