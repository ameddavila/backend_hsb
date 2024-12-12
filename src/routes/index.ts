import { Router } from "express";
import userRoutes from "../modules/users/routes/user.routes";

const router = Router();

router.use("/users", userRoutes);

export default router;
