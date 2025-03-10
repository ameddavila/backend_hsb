import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { authMiddleware } from "@middleware/auth.middleware"; // Se usa `{}` ya que no es export default
import { checkPermission } from "@middleware/permission.middleware"; // Se usa `{}`

const router = Router();

// ✅ Rutas públicas
router.post("/register", createUser);

// ✅ Rutas protegidas con middleware
router.get("/", authMiddleware, checkPermission(["admin", "user"]), getUsers);
router.put("/:id", authMiddleware, checkPermission(["admin"]), updateUser);
router.delete("/:id", authMiddleware, checkPermission(["admin"]), deleteUser);

export default router;
