// src/routes/index.ts

import { Router } from "express";
import authRoute from "../modules/auth/routes/auth.routes";
import userRoutes from "../modules/users/routes/user.routes";
import menuRoutes from "../modules/users/routes/menu.routes";
import configRoutes from "../modules/config/routes/config.routes";
import zonaRoutes from "../modules/biometrico/routes/zona.routes"; // ✅ Importar

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoute);
router.use("/menus", menuRoutes);
router.use("/config", configRoutes);
router.use("/biometrico/zonas", zonaRoutes); // 👈 Prefijo global

export default router;
