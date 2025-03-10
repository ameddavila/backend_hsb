import { Router } from "express";
import { authMiddleware } from "@middleware/auth.middleware";
import { checkPermission } from "@middleware/permission.middleware";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

const router = Router();

// ✅ Aplica `authMiddleware` solo en rutas que lo necesiten
router.post(
  "/register",
  authMiddleware,
  checkPermission(["admin"]),
  createUser
);
router.get("/", authMiddleware, checkPermission(["admin", "user"]), getUsers);
router.put("/:id", authMiddleware, checkPermission(["admin"]), updateUser);
router.delete("/:id", authMiddleware, checkPermission(["admin"]), deleteUser);

export default router;
