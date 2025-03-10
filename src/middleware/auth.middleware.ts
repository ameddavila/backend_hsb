import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "../types/express"; // 🔥 Importamos la extensión de Request

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token requerido" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      roleId?: number;
      roleName?: string;
    };

    req.user = {
      userId: decoded.userId,
      roleId: decoded.roleId || 0,
      roleName: decoded.roleName || "Invitado",
    };

    next();
  } catch (error) {
    res.status(403).json({ message: "Token inválido o expirado" });
  }
};
