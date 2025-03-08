// ==================== AUTH CONTROLLER ====================
import { Request, Response } from "express";
import { loginUser } from "../services/auth.service";
import { generateAccessToken } from "../services/jwt.service";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usernameOrEmail, password } = req.body;
    const { accessToken, refreshToken, csrfToken } = await loginUser(
      usernameOrEmail,
      password
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    res.json({ csrfToken });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(401).json({
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

export const handleRefreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(403).json({ error: "Token de refresco no proporcionado" });
      return;
    }

    const newAccessToken = generateAccessToken({ refreshToken }); // 🔹 Ahora usamos la función correcta

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ message: "Token refrescado exitosamente" });
  } catch (error) {
    console.error("❌ Error en /refresh:", error);
    res.status(403).json({
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("csrfToken");
    res.status(200).json({ message: "Sesión cerrada" });
  } catch (error) {
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
};
