import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { handleRefreshToken } from "../controllers/auth.controller";
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos de login por IP
  message: "Demasiados intentos de login, intenta más tarde",
});

const router = Router();

// Ruta para el login
router.post("/login", login);

// Ruta para renovar el accessToken
router.post("/refresh", handleRefreshToken);

export default router;
