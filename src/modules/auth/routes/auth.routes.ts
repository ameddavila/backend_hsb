import express from "express";
import { login, handleRefreshToken } from "../controllers/auth.controller";

// Importamos nuestros nuevos middlewares
import { verifyRefreshTokenMiddleware } from "../middleware/verifyRefreshToken.middleware";
import { verifyCsrfToken } from "../middleware/csrf.middleware";

const router = express.Router();

/**
 * Login:
 * - No requiere CSRF porque el usuario todavía no tiene la cookie "csrfToken".
 */
router.post("/login", login);

/**
 * Refresh:
 * 1. Verifica el Refresh Token para extraer userId (verifyRefreshTokenMiddleware)
 * 2. Verifica CSRF (verifyCsrfToken)
 * 3. handleRefreshToken genera los nuevos tokens y rota el CSRF
 */
router.post("/refresh", verifyRefreshTokenMiddleware, verifyCsrfToken, handleRefreshToken);

export default router;
