import { Router } from "express";
import { authMiddleware } from "@middleware/auth.middleware"; // Asegura autenticación

import { checkPermission } from "@middleware/permission.middleware";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

const router = Router();

router.use(authMiddleware); // Aplica autenticación en todas las rutas

router.post("/register", checkPermission(["admin"]), createUser);
router.get("/", checkPermission(["admin", "user"]), getUsers);
router.put("/:id", checkPermission(["admin"]), updateUser);
router.delete("/:id", checkPermission(["admin"]), deleteUser);

export default router;
