import { Request, Response, NextFunction } from "express";
import {
  generateCsrfToken,
  validateCsrfToken,
} from "../modules/auth/services/csrf.service";

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

  if (!validateCsrfToken(csrfToken, clientCsrfToken)) {
    res.status(403).json({ error: "Token CSRF inválido" });
    return;
  }

  next();
};
