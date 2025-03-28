import { Request, Response } from "express";
import RefreshTokenModel from "../models/refreshToken.model";
import UserModel from "@modules/users/models/user.model"; // Asegúrate de importar tu modelo de usuario
import RoleModel from "@modules/users/models/role.model";
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

    await RefreshTokenModel.create({
      userId: result.userId,
      token: result.refreshToken,
      deviceId: deviceId || "Unknown",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isActive: true,
    });

    const csrfToken = generateCsrfToken(result.userId);

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

    res.cookie("csrfToken", csrfToken, {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
    });

    console.log("🔐 [LOGIN] Cookies enviadas");
    console.log("🧑 Usuario:", {
      id: result.userId,
      username: result.username,
      email: result.email,
      role: result.userRole,
    });
    console.log("🔑 CSRF Token:", csrfToken);

    res.status(200).json({
      id: result.userId,
      username: result.username,
      email: result.email,
      role: result.userRole || "user",
      csrfToken,
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
      console.warn("⛔ No se proporcionó refreshToken");
      res.status(403).json({ error: "Token de refresco no proporcionado." });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded || typeof decoded === "string" || !("userId" in decoded)) {
      console.warn("⛔ RefreshToken inválido o expirado");
      res.status(403).json({ error: "Token de refresco inválido o expirado." });
      return;
    }

    const userId = decoded.userId as string;

    const oldToken = await RefreshTokenModel.findOne({
      where: { token: refreshToken, isActive: true },
    });
    if (!oldToken) {
      console.warn("⛔ RefreshToken no válido en BD");
      res.status(403).json({ error: "Token de refresco no válido." });
      return;
    }

    
    const user = await UserModel.findByPk(userId, {
      include: [
        {
          model: RoleModel,
          as: "roles",
          through: { attributes: [] },
        },
      ],
    });


    if (!user) {
      console.warn("⛔ Usuario no encontrado con ID:", userId);
      res.status(404).json({ error: "Usuario no encontrado." });
      return;
    }
    const userRole = user.roles?.[0]?.name || "user";

    const deviceId = oldToken.deviceId;
    await oldToken.update({ isActive: false });

    const newRefreshToken = generateRefreshToken({ userId });
    const newAccessToken = generateAccessToken({ userId });
    const csrfToken = generateCsrfToken(userId);

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

    res.cookie("csrfToken", csrfToken, {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
    });

    console.log("🔄 [REFRESH] Tokens actualizados y cookies reenviadas");
    console.log("🧑 Usuario:", {
      id: user.id,
      username: user.username,
      email: user.email,
      role: userRole,
    });
    console.log("🔑 CSRF Token:", csrfToken);

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: userRole || "user",
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

    console.log("🚪 Logout exitoso. Cookies eliminadas.");

    res.status(200).json({ message: "Sesión cerrada correctamente." });
  } catch (error) {
    console.error("❌ Error en logout:", error);
    res.status(500).json({ error: "Error al cerrar sesión." });
  }
};
