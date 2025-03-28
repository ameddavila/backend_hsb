import express from "express";
import { login, handleRefreshToken } from "../controllers/auth.controller";

// Importamos nuestros nuevos middlewares
import { verifyRefreshTokenMiddleware } from "../middleware/verifyRefreshToken.middleware";
import { verifyCsrfToken } from "@modules/auth/middleware/csrf.middleware";
import { getCsrfTokenPublic } from "../controllers/csrf.controller";

const router = express.Router();

// ✅ Endpoint público para obtener CSRF
router.get("/csrf-token", getCsrfTokenPublic);

router.get("/test-cookie", (req, res) => {
    res.cookie("prueba", "valor", {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    });
    res.send("🍪 Cookie enviada");
  });
  
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
