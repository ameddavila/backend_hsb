import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

const router = Router();

router.post("/", createUser); // Crear usuario
router.get("/", getUsers); // Obtener lista de usuarios
router.put("/:id", updateUser); // Actualizar usuario
router.delete("/:id", deleteUser); // Desactivar usuario

export default router;
