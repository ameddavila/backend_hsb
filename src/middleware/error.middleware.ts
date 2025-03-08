import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("❌ Error:", err);

  const statusCode = err.status ? err.status : 500; // Asegurar que `status` sea un número válido
  res.status(statusCode).json({
    error: err.message || "Error interno del servidor",
  });
};
