import { Request, Response, NextFunction } from "express";
import { validateCsrfToken, generateCsrfToken } from "../services/csrf.service";

interface RequestWithUser extends Request {
  user?: {
    userId: string;
  };
}

export const verifyCsrfToken = (req: Request, res: Response, next: NextFunction): void => {
  const csrfHeader = req.headers["x-csrf-token"] as string;
  const csrfCookie = req.cookies["csrfToken"];

  console.log("🛡️ Verificando CSRF token...");
  console.log("📥 Header x-csrf-token:", csrfHeader);
  console.log("🍪 Cookie csrfToken:", csrfCookie);

  if (!csrfHeader || !csrfCookie) {
    console.warn("🚫 CSRF token ausente (header o cookie)");
    res.status(403).json({ error: "CSRF token ausente" });
    return;
  }

  if (csrfHeader !== csrfCookie) {
    console.warn("🚫 CSRF token no coincide entre header y cookie");
    res.status(403).json({ error: "CSRF token no coincide" });
    return;
  }

  const reqUser = req as RequestWithUser;
  const userId = reqUser.user?.userId;

  if (!userId) {
    console.warn("🚫 No se encontró userId en el request para validar CSRF");
    res.status(401).json({ error: "No se encontró userId para CSRF" });
    return;
  }

  const expectedToken = generateCsrfToken(userId);
  const isValid = csrfHeader === expectedToken;

  console.log("🧠 Comparando CSRF:");
  console.log("  ↪ userId:", userId);
  console.log("  ↪ token recibido:", csrfHeader);
  console.log("  ↪ token esperado:", expectedToken);
  console.log("  ↪ válido:", isValid);

  if (!isValid) {
    console.warn("🚫 CSRF token inválido para el userId");
    res.status(403).json({ error: "CSRF token inválido" });
    return;
  }

  console.log("✅ CSRF token válido. Acceso permitido.");
  next();
};
