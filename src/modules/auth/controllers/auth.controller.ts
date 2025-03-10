import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import RefreshTokenModel from "../models/refreshToken.model";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/jwt.service";

export const handleRefreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(403)
        .json({ error: "Token de refresco no proporcionado" });
    }

    const tokenRecord = await RefreshTokenModel.findOne({
      where: { token: refreshToken, isActive: true },
    });

    if (!tokenRecord) {
      return res
        .status(403)
        .json({ error: "Token de refresco inválido o expirado" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as {
      userId: string;
    };

    // Revocar el `refreshToken` anterior
    await RefreshTokenModel.update(
      { isActive: false },
      { where: { token: refreshToken } }
    );

    // Generar nuevo `refreshToken`
    const newRefreshToken = generateRefreshToken({ userId: decoded.userId });

    // Guardar nuevo `refreshToken` en la base de datos
    await RefreshTokenModel.create({
      userId: decoded.userId,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      isActive: true,
    });

    // Generar nuevo `accessToken`
    const newAccessToken = generateAccessToken({ userId: decoded.userId });

    // Enviar nuevo `refreshToken` en una cookie segura
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await RefreshTokenModel.update(
        { isActive: false },
        { where: { token: refreshToken } }
      );
    }

    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Sesión cerrada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
};
