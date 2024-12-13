import { Router } from "express";
import authRoute from "../modules/auth/routes/auth.routes";
import userRoutes from "../modules/users/routes/user.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoute);
export default router;
