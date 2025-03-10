import express from "express";
import { login, handleRefreshToken } from "../controllers/auth.controller"; // Asegurar que el archivo tiene la función `login`

const router = express.Router();

router.post("/login", login);
router.post("/refresh", handleRefreshToken);

export default router;
