import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/custom";

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies["jwt"];

  if (!token) {
    res.status(401).json({ error: "Token requerido" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & {
      userId: string;
    };

    req.user = { userId: decoded.userId };

    next();
  } catch (error) {
    res.status(403).json({ message: "Token inválido o expirado" });
  }
};
