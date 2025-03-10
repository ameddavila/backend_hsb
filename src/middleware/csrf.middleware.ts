import { Request, Response, NextFunction } from "express";

export const verifyCsrfToken = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const csrfToken = req.headers["x-csrf-token"] as string;

  if (!csrfToken) {
    return res.status(403).json({ error: "Token CSRF no proporcionado" });
  }

  if (csrfToken !== process.env.CSRF_SECRET) {
    return res.status(403).json({ error: "Token CSRF inválido" });
  }

  next();
};
