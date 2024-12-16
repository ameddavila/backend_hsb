import { Request, Response } from "express";
import { loginUser, refreshToken } from "../services/auth.service";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usernameOrEmail, password } = req.body;
    const { accessToken, refreshToken, csrfToken } = await loginUser(
      usernameOrEmail,
      password
    );

    // Configurar la cookie HttpOnly para el accessToken
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // En producción, requiere HTTPS
      sameSite: "strict", // Evita CSRF
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    // Configurar la cookie HttpOnly para el refreshToken
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
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

export const handleRefreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw new Error("Token de refresco no proporcionado");

    const accessToken = await refreshToken(token);

    // Configurar nueva cookie HttpOnly para accessToken
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    res.sendStatus(200);
  } catch (error) {
    res.status(403).json({
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};
