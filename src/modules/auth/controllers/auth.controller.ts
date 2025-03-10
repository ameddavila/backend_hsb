import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import RefreshTokenModel from "../models/refreshToken.model";
import { loginUser } from "../services/auth.service";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../services/jwt.service";
import { generateCsrfToken } from "../services/csrf.service";

/**
 * **Login** - Autentica al usuario y envía tokens de acceso y refresco en cookies httpOnly.
 * @returns CSRF Token en la respuesta
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      res.status(400).json({ message: "Usuario y contraseña requeridos." });
      return;
    }

    const result = await loginUser(usernameOrEmail, password);

    if (!result.success) {
      res.status(result.status ?? 500).json({ message: result.message });
      return;
    }

    // Guardar tokens en cookies seguras (no se envían en la respuesta JSON)
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ csrfToken: result.csrfToken });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * **Renovación de tokens** - Verifica y genera nuevos tokens, manteniendo la sesión activa.
 * @returns CSRF Token en la respuesta
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

    // Verificar y decodificar el `refreshToken`
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded || typeof decoded === "string" || !("userId" in decoded)) {
      res.status(403).json({ error: "Token de refresco inválido o expirado." });
      return;
    }

    const userId = (decoded as JwtPayload).userId;

    // Buscar si el `refreshToken` está activo en la base de datos
    const tokenRecord = await RefreshTokenModel.findOne({
      where: { token: refreshToken, isActive: true },
    });

    if (!tokenRecord) {
      res
        .status(403)
        .json({ error: "Token de refresco no encontrado o inactivo." });
      return;
    }

    // **Revocar el token anterior**
    await RefreshTokenModel.update(
      { isActive: false },
      { where: { token: refreshToken } }
    );

    // **Generar nuevos tokens**
    const newRefreshToken = generateRefreshToken({ userId });
    const newAccessToken = generateAccessToken({ userId });

    // **Guardar el nuevo `refreshToken` en la base de datos**
    await RefreshTokenModel.create({
      userId,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      isActive: true,
    });

    // **Actualizar cookies con los nuevos tokens**
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // **Generar y devolver un nuevo `csrfToken`**
    const csrfToken = generateCsrfToken(userId);
    res.status(200).json({ csrfToken });
  } catch (error) {
    console.error("❌ Error en refreshToken:", error);
    res.status(403).json({ message: "Token inválido o expirado." });
  }
};

/**
 * **Logout** - Revoca tokens y cierra la sesión eliminando las cookies.
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res
        .status(400)
        .json({ message: "No hay token de refresco para eliminar." });
      return;
    }

    // **Revocar el `refreshToken` en la base de datos**
    const tokenRecord = await RefreshTokenModel.findOne({
      where: { token: refreshToken },
    });

    if (tokenRecord) {
      await RefreshTokenModel.update(
        { isActive: false },
        { where: { token: refreshToken } }
      );
    }

    // **Eliminar cookies en el cliente**
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Sesión cerrada correctamente." });
  } catch (error) {
    console.error("❌ Error en logout:", error);
    res.status(500).json({ error: "Error al cerrar sesión." });
  }
};
