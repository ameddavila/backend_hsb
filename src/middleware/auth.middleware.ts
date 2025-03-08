import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/custom";

interface DecodedUser {
  userId: string;
  roleId: number;
  roleName: string;
}

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload &
      DecodedUser;

    if (!decoded.userId || !decoded.roleId || !decoded.roleName) {
      res.status(403).json({ message: "Token inválido" });
      return;
    }

    req.user = {
      userId: decoded.userId,
      roleId: decoded.roleId,
      roleName: decoded.roleName,
    };

    next();
  } catch (error) {
    res.status(403).json({ message: "Token inválido o expirado" });
  }
};
