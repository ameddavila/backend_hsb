import { Router } from "express";
import authRoute from "../modules/auth/routes/auth.routes";
import userRoutes from "../modules/users/routes/user.routes";
import menuRoutes from "../modules/users/routes/menu.routes";
import configRoutes from "../modules/config/routes/config.routes"

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoute);
router.use("/menus", menuRoutes);
router.use("/config",configRoutes)
export default router;
