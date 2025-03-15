// src/modules/auth/middleware/verifyRefreshToken.middleware.ts
import { RequestHandler } from "express";
import { verifyRefreshToken } from "../services/jwt.service";
import { JwtPayload } from "jsonwebtoken";

interface RequestWithUser extends Express.Request {
  user?: { userId: string };
}

export const verifyRefreshTokenMiddleware: RequestHandler = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ error: "Falta refreshToken" });
    return; // <--- Terminar la ejecución
  }

  try {
    const decoded = verifyRefreshToken(refreshToken) as JwtPayload;
    if (!decoded.userId) {
      res.status(403).json({ error: "Refresh token inválido" });
      return;
    }
    // "Casteas" el request para asignar userId
    const requestWithUser = req as RequestWithUser;
    requestWithUser.user = { userId: decoded.userId };
    next();
  } catch (error) {
    console.error("Error al verificar refresh token:", error);
    res.status(403).json({ error: "Refresh token inválido" });
    return;
  }
};
