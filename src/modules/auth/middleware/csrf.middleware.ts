// src/modules/auth/middleware/csrf.middleware.ts
import { Request, Response, NextFunction } from "express";
import { validateCsrfToken } from "../services/csrf.service";

interface RequestWithUser extends Request {
  user?: {
    userId: string;
  };
}

export const verifyCsrfToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const csrfHeader = req.headers["x-csrf-token"] as string;
  const csrfCookie = req.cookies["csrfToken"];

  if (!csrfHeader || !csrfCookie) {
    res.status(403).json({ error: "CSRF token ausente" });
    return;
  }

  if (csrfHeader !== csrfCookie) {
    res.status(403).json({ error: "CSRF token no coincide" });
    return;
  }

  // Hacemos casting a nuestra interfaz extendida
  const reqUser = req as RequestWithUser;
  if (!reqUser.user?.userId) {
    res.status(401).json({ error: "No se encontró userId para CSRF" });
    return;
  }

  const isValid = validateCsrfToken(reqUser.user.userId, csrfHeader);
  if (!isValid) {
    res.status(403).json({ error: "CSRF token inválido" });
    return;
  }

  next();
};
