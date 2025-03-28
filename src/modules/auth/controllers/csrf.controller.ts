import { RequestWithUser } from "../types/requestWithUser";
import { Response } from "express";
import { generateCsrfToken } from "../services/csrf.service";

export const getCsrfTokenPublic = (req: RequestWithUser, res: Response) => {
  const userId = req.user?.userId ?? "publico";
  const csrfToken = generateCsrfToken(userId);

  // 🔍 Seguimiento completo
  console.log("🔐 Generando CSRF Token:");
  console.log("➡️ userId:", userId);
  console.log("🔑 token generado:", csrfToken);
  console.log("🍪 Configuración de la cookie:", {
    name: "csrfToken",
    value: csrfToken,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  res
    .cookie("csrfToken", csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })
    .json({ csrfToken });
};
