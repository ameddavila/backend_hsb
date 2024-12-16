import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../modules/auth/services/jwt.service";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("Token no encontrado");

    const decoded = verifyAccessToken(token) as {
      userId: string;
      roleId: number;
      roleName: string;
    };
    req.user = {
      userId: decoded.userId,
      roleId: decoded.roleId,
      roleName: decoded.roleName,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};
