import { Router } from "express";
import { login, handleRefreshToken } from "../controllers/auth.controller";

const router = Router();

// ✅ Ruta de inicio de sesión
router.post("/login", login);

// ✅ Ruta de actualización del token
router.post("/refresh", handleRefreshToken);

export default router;
