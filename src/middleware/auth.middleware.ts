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
 * - Extrae el token JWT (desde el header "Authorization: Bearer ..." o desde la cookie "accessToken")
 * - Verifica y decodifica
 * - Asigna `req.user`
 */
export const authMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): void => {

  let token: string | undefined;
  const authHeader = req.headers.authorization;

  // 1. Revisar si tenemos un header "Authorization" que empiece con "Bearer "
  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Tomamos el token tras "Bearer "
    token = authHeader.split(" ")[1];
  } else {
    // 2. Si no, usamos la cookie "accessToken"
    token = req.cookies?.accessToken;
  }

  // 3. Si al final no hay token ni en header ni en cookie, error
  if (!token) {
    res.status(401).json({
      message: "No autorizado: Falta o formato incorrecto del token",
    });
    return;
  }

  try {
    // 4. Verificamos con JWT
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload & {
      userId: string;
      roleId?: number;
      roleName?: string;
    };

    // 5. Chequeamos si hay userId en el payload
    if (!decoded?.userId) {
      res.status(401).json({ message: "Token inválido: Falta userId" });
      return;
    }

    // 6. Asignamos a req.user
    req.user = {
      userId: decoded.userId,
      roleId: decoded.roleId,
      roleName: decoded.roleName,
    };

    next();
  } catch (error) {
    console.error("❌ Error al verificar token:", error);
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};
