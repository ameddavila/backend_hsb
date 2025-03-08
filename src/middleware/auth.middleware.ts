import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { verifyAccessToken } from "../modules/auth/services/jwt.service";
import logger from "../utils/logger";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token requerido" }); // 🔹 Evita el acceso sin autenticación
    }

    const decoded = verifyAccessToken(token) as JwtPayload & {
      userId: string;
      roleId: number;
      roleName: string;
    };

    (req as any).user = {
      userId: decoded.userId,
      roleId: decoded.roleId,
      roleName: decoded.roleName,
    };

    next();
  } catch (error) {
    logger.error("Error en autenticación:", error);
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};
