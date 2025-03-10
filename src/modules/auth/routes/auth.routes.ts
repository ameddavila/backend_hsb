import express from "express";
import { login, handleRefreshToken } from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", login);
router.post("/refresh", handleRefreshToken);

export default router;
