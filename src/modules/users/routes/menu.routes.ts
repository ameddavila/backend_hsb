// src/modules/users/routes/menu.routes.ts
import { Router } from "express";
import {
  getAllMenus,
  createMenu,
  deleteMenu,
  getMenuById,
} from "@modules/users/controllers/menu.controller";
import { authMiddleware } from "@middleware/auth.middleware";
import { checkPermission } from "@middleware/permission.middleware";
import { getUserMenus } from "@modules/users/controllers/menuAccess.controller";

const router = Router();

/**
 * GET /menus/my-menus
 * - Retorna los menús específicos del usuario autenticado.
 * - Requiere estar autenticado y (opcional) verificar CSRF.
 */
router.get("/my-menus", authMiddleware, verifyCsrfToken, getUserMenus);


/**
 * GET /menus
 * - Ejemplo: solo roles "Administrador" o "Usuario" pueden ver.
 */
router.get("/", authMiddleware, checkPermission(["Administrador", "Usuario"]), getAllMenus);

/**
 * POST /menus
 * - Solo Administrador puede crear menús
 */
router.post("/", authMiddleware, checkPermission(["Administrador"]), createMenu);

/**
 * GET /menus/:id
 */
router.get("/:id", authMiddleware, checkPermission(["Administrador", "Usuario"]), getMenuById);

/**
 * DELETE /menus/:id
 * - Solo Administrador
 */
router.delete("/:id", authMiddleware, checkPermission(["Administrador"]), deleteMenu);

export default router;