import { Request, Response } from "express";
import RefreshTokenModel from "../models/refreshToken.model";
import { loginUser } from "../services/auth.service";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../services/jwt.service";
import { generateCsrfToken } from "../services/csrf.service";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Login - Autentica al usuario y envía tokens de acceso y refresco en cookies httpOnly.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usernameOrEmail, password, deviceId } = req.body;

    if (!usernameOrEmail || !password) {
      res.status(400).json({ message: "Usuario y contraseña requeridos." });
      return;
    }

    const result = await loginUser(usernameOrEmail, password, req);
    if (!result.success) {
      res.status(result.status).json({ message: result.message });
      return;
    }

    // Guardar refresh token en BD
    await RefreshTokenModel.create({
      userId: result.userId,
      token: result.refreshToken,
      deviceId: deviceId || "Unknown",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isActive: true,
    });

    // Enviar cookies
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
    });

    res.cookie("csrfToken", result.csrfToken, {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
    });

    res.status(200).json({
      id: result.userId,
      username: result.username,
      email: result.email,
      role: result.userRole || "user",
      csrfToken: result.csrfToken,
    });
    
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * Refresh Token - Genera nuevos tokens y actualiza las cookies.
 */
export const handleRefreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(403).json({ error: "Token de refresco no proporcionado." });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded || typeof decoded === "string" || !("userId" in decoded)) {
      res.status(403).json({ error: "Token de refresco inválido o expirado." });
      return;
    }

    const userId = decoded.userId as string;

    const oldToken = await RefreshTokenModel.findOne({
      where: { token: refreshToken, isActive: true },
    });
    if (!oldToken) {
      res.status(403).json({ error: "Token de refresco no válido." });
      return;
    }

    const deviceId = oldToken.deviceId;
    await oldToken.update({ isActive: false });

    const newRefreshToken = generateRefreshToken({ userId });
    const newAccessToken = generateAccessToken({ userId });

    await RefreshTokenModel.create({
      userId,
      token: newRefreshToken,
      deviceId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isActive: true,
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
    });

    const csrfToken = generateCsrfToken(userId);
    res.cookie("csrfToken", csrfToken, {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
    });

    res.status(200).json({
      message: "Tokens refrescados correctamente",
      csrfToken,
    });
  } catch (error) {
    console.error("❌ Error en refreshToken:", error);
    res.status(403).json({ message: "Token inválido o expirado." });
  }
};

/**
 * Logout - Revoca el token y limpia las cookies.
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(400).json({ message: "No hay token de refresco para eliminar." });
      return;
    }

    const tokenRecord = await RefreshTokenModel.findOne({
      where: { token: refreshToken },
    });

    if (tokenRecord) {
      await tokenRecord.update({ isActive: false });
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
    });

    res.clearCookie("csrfToken", {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
    });

    res.status(200).json({ message: "Sesión cerrada correctamente." });
  } catch (error) {
    console.error("❌ Error en logout:", error);
    res.status(500).json({ error: "Error al cerrar sesión." });
  }
};
