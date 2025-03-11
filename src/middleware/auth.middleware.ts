import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface RequestWithUser extends Request {
  user?: {
    userId: string;
    roleId?: number;
    roleName?: string;
  };
}

export const authMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  console.log("🔍 Encabezado de autorización recibido:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("🚨 No se encontró un token válido en el encabezado.");
    res
      .status(401)
      .json({ message: "No autorizado: Falta o formato incorrecto del token" });
    return;
  }

  const token =
    req.headers.authorization?.split(" ")[1] || req.cookies.accessToken;

  console.log("🔍 Token extraído:", token);

  if (!token) {
    console.error("🚨 El token está vacío o es indefinido.");
    res.status(401).json({ message: "No autorizado: Token inválido o vacío" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload & {
      userId: string;
      roleId?: number;
      roleName?: string;
    };

    console.log("✅ Token decodificado:", decoded);

    if (!decoded || !decoded.userId) {
      console.error("🚨 Token inválido: Falta userId.");
      res.status(401).json({ message: "Token inválido" });
      return;
    }

    req.user = {
      userId: decoded.userId,
      roleId: decoded.roleId ?? undefined,
      roleName: decoded.roleName ?? undefined,
    };

    console.log("✅ Usuario autenticado:", req.user);
    next();
  } catch (error) {
    console.error("🚨 Error al verificar el token:", error);
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};
