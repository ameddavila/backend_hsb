import { Router } from "express";
import authRoute from "../modules/auth/routes/auth.routes";
import userRoutes from "../modules/users/routes/user.routes";
import menuRoutes from "../modules/users/routes/menu.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoute);
router.use("/menus", menuRoutes);
export default router;
