import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} from "@modules/users/controllers/user.controller";
import { authMiddleware } from "@middleware/auth.middleware";
import { checkPermission } from "@middleware/permission.middleware";

const router = Router();

// Registrar usuario (Ruta pública)
router.post("/register", createUser);

// Obtener usuarios (Protegido con autenticación y permisos)
router.get(
  "/",
  authMiddleware,
  checkPermission(["Administrador", "Usuario"]), // Corregido
  getUsers as any
);

// Actualizar usuario (Solo Administrador)
router.put(
  "/:id",
  authMiddleware,
  checkPermission(["Administrador"]), // Corregido
  updateUser as any
);

// Eliminar usuario (Solo Administrador)
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(["Administrador"]), // Corregido
  deleteUser as any
);

export default router;
