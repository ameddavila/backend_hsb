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

  console.log("🔐 [authMiddleware] Iniciando validación de token...");

  // 1. Revisar si tenemos un header "Authorization" que empiece con "Bearer "
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    console.log("📥 Token recibido desde header Authorization.");
  } else {
    token = req.cookies?.accessToken;
    if (token) {
      console.log("🍪 Token recibido desde cookie accessToken.");
    }
  }

  // 2. Si al final no hay token ni en header ni en cookie, error
  if (!token) {
    console.warn("⚠️ No se recibió token de acceso en header ni cookies.");
    res.status(401).json({
      message: "No autorizado: Falta o formato incorrecto del token",
    });
    return;
  }

  try {
    // 3. Verificamos con JWT
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload & {
      userId: string;
      roleId?: number;
      roleName?: string;
    };

    console.log("✅ Token decodificado con éxito:", decoded);

    // 4. Chequeamos si hay userId en el payload
    if (!decoded?.userId) {
      console.warn("⛔ Token no contiene userId.");
      res.status(401).json({ message: "Token inválido: Falta userId" });
      return;
    }

    // 5. Asignamos a req.user
    req.user = {
      userId: decoded.userId,
      roleId: decoded.roleId,
      roleName: decoded.roleName,
    };

    console.log("👤 Usuario autenticado:", req.user);

    next();
  } catch (error) {
    console.error("❌ Error al verificar token:", error);
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

