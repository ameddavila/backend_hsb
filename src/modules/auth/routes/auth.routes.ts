import { Router } from "express";
import { login, handleRefreshToken } from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);
router.post("/refresh", handleRefreshToken); // Endpoint para refrescar tokens

export default router;
