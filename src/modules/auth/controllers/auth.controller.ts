import { Request, Response } from "express";
import { loginUser, refreshToken } from "../services/auth.service";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usernameOrEmail, password } = req.body;
    const { accessToken, refreshToken, csrfToken } = await loginUser(
      usernameOrEmail,
      password
    );

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction, // 🔹 Solo seguro en producción
      sameSite: isProduction ? "none" : "lax", // 🔹 Evita problemas en local
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    // Devolver solo el CSRF token al cliente
    res.json({ csrfToken });
  } catch (error) {
    res.status(401).json({
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

export const handleRefreshToken = async (req: Request, res: Response) => {
  try {
    console.log("🔍 Cookies recibidas:", req.cookies);

    const token = req.cookies.refreshToken || req.cookies.refreshtoken;
    if (!token) throw new Error("Token de refresco no proporcionado");

    console.log("✅ Token de refresco recibido:", token);

    const accessToken = await refreshToken(token);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("❌ Error en /refresh:", error);
    res.status(403).json({
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};
