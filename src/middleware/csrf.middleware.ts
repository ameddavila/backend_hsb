import { Request, Response, NextFunction } from "express";
import { validateCsrfToken } from "../modules/auth/services/csrf.service";

export const csrfMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const csrfToken = req.cookies.csrfToken;
  const clientCsrfToken = req.headers["x-csrf-token"] as string;

  if (!csrfToken || !clientCsrfToken) {
    res.status(403).json({ error: "Token CSRF no proporcionado" });
    return;
  }

  // Validar el token CSRF usando el ID del usuario
  const userId = req.user?.userId; // Suponiendo que el middleware de autenticación ya ha validado al usuario
  if (!userId || !validateCsrfToken(userId, clientCsrfToken)) {
    res.status(403).json({ error: "Token CSRF inválido" });
    return;
  }

  next();
};
