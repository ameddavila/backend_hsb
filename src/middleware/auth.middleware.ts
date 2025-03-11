import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extender `Request` para incluir `user`
export interface RequestWithUser extends Request {
  user?: {
    userId: string;
    roleId?: number;
    roleName?: string;
  };
}

export const authMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  // Verificar si el header de autorización está presente y bien formado
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ message: "No autorizado: Falta o formato incorrecto del token" });
    return;
  }

  const token = authHeader.split(" ")[1];

  // Verificar que el token no sea `undefined`
  if (!token) {
    res.status(401).json({ message: "No autorizado: Token no encontrado" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as JwtPayload & {
      userId: string;
      roleId?: number;
      roleName?: string;
    };

    if (!decoded || !decoded.userId) {
      res.status(401).json({ message: "Token inválido: Falta userId" });
      return;
    }

    req.user = {
      userId: decoded.userId,
      roleId: decoded.roleId ?? undefined,
      roleName: decoded.roleName ?? undefined,
    };

    next();
  } catch (error) {
    console.error("Error en authMiddleware:", error);
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};
