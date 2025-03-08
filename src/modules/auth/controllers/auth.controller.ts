import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import RefreshTokenModel from "../models/refreshToken.model";
import { generateAccessToken } from "../services/jwt.service";

export const handleRefreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(403).json({ error: "Token de refresco no proporcionado" });
      return;
    }

    const tokenRecord = await RefreshTokenModel.findOne({
      where: { token: refreshToken, isActive: true },
    });

    if (!tokenRecord) {
      res
        .status(403)
        .json({ error: "Token de refresco inválido o ya expirado" });
      return;
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as {
      userId: string;
    };

    // Generar nuevo `accessToken`
    const newAccessToken = generateAccessToken({ userId: decoded.userId });

    res.cookie("jwt", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Token refrescado exitosamente" });
  } catch (error) {
    res.status(403).json({ message: "Token inválido o expirado" });
  }
};
