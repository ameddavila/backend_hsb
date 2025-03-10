import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      roleId: number;
      roleName: string;
    };

    req.user = {
      userId: decoded.userId,
      roleId: decoded.roleId, // Agregado
      roleName: decoded.roleName, // Agregado
    };

    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};
