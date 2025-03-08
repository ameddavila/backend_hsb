import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Error interno del servidor",
  });
};
