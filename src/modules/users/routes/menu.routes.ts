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
import { verifyCsrfToken } from "@modules/auth/middleware/csrf.middleware";

const router = Router();

/**
 * GET /menus/my-menus
 * @desc Retorna la lista de menús a los que el usuario autenticado tiene acceso, 
 *       basándose en sus roles y la relación Role ↔ Menus. 
 * @middlewares - authMiddleware: valida que el usuario esté autenticado. 
 *              - verifyCsrfToken: opcionalmente valida el token CSRF.
 */
router.get(
  "/my-menus",
  authMiddleware,
  //verifyCsrfToken, // Si no deseas CSRF en GET, retira esta línea.
  getUserMenus
);

/**
 * GET /menus
 * @desc Retorna todos los menús existentes (CRUD general). 
 *       Solo pueden acceder roles "Administrador" o "Usuario".
 * @middlewares - authMiddleware: requiere autenticación.
 *              - checkPermission(["Administrador", "Usuario"]): restringe el acceso a esos roles.
 */
router.get(
  "/",
  authMiddleware,
  checkPermission(["Administrador", "Usuario"]),
  getAllMenus
);

/**
 * POST /menus
 * @desc Crea un nuevo menú. 
 *       Solo puede hacerlo el rol "Administrador".
 * @middlewares - authMiddleware: requiere autenticación.
 *              - checkPermission(["Administrador"]): restringe el acceso.
 */
router.post(
  "/",
  authMiddleware,
  checkPermission(["Administrador"]),
  createMenu
);

/**
 * GET /menus/:id
 * @desc Obtiene la información de un menú específico por su ID. 
 *       Accesible a "Administrador" o "Usuario".
 * @middlewares - authMiddleware: requiere autenticación.
 *              - checkPermission(["Administrador", "Usuario"]): restringe el acceso.
 */
router.get(
  "/:id",
  authMiddleware,
  checkPermission(["Administrador", "Usuario"]),
  getMenuById
);

/**
 * DELETE /menus/:id
 * @desc Elimina (físicamente) un menú por su ID. 
 *       Solo puede hacerlo el rol "Administrador".
 * @middlewares - authMiddleware: requiere autenticación.
 *              - checkPermission(["Administrador"]): restringe el acceso.
 */
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(["Administrador"]),
  deleteMenu
);

export default router;
