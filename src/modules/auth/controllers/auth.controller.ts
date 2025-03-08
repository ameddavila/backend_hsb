import { Request, Response } from "express";
import { loginUser } from "../services/auth.service";
import { generateAccessToken } from "../services/jwt.service";
import { log } from "console";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("llego", req.body);
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      res
        .status(400)
        .json({ message: "El email/username y la contraseña son requeridos." });
      return;
    }

    const result = await loginUser(usernameOrEmail, password);

    if (!result.success) {
      res.status(result.status).json({ message: result.message });
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor" });
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

    const newAccessToken = generateAccessToken({ refreshToken });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    res.status(200).json({ message: "Token refrescado exitosamente" });
  } catch (error) {
    console.error("❌ Error en /refresh:", error);
    res.status(403).json({
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};
