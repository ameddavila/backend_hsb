import { Router } from "express";
import {
  obtenerZonasController,
  crearZonaController,
  getZonaById,
  updateZona,
  deleteZona,
} from "@modules/biometrico/controllers/zona.controller";

import { authMiddleware } from "@middleware/auth.middleware";
import { checkPermission } from "@middleware/permission.middleware";
import { verifyCsrfToken } from "@modules/auth/middleware/csrf.middleware";

const router = Router();

/**
 * GET /zonas
 * @desc Retorna todas las zonas registradas con su configuración biométrica asociada.
 * @middlewares - authMiddleware: requiere autenticación.
 *              - checkPermission(["Administrador", "Usuario"]): permite solo estos roles.
 */
router.get(
  "/",
  authMiddleware,
  checkPermission(["Administrador", "Usuario"]),
  obtenerZonasController
);

/**
 * GET /zonas/:id
 * @desc Retorna una zona específica por su ID.
 * @middlewares - authMiddleware: requiere autenticación.
 *              - checkPermission(["Administrador", "Usuario"]): permite solo estos roles.
 */
router.get(
  "/:id",
  authMiddleware,
  checkPermission(["Administrador", "Usuario"]),
  getZonaById
);

/**
 * POST /zonas
 * @desc Crea una nueva zona con su configuración biométrica asociada.
 * @middlewares - authMiddleware: requiere autenticación.
 *              - checkPermission(["Administrador"]): solo administradores pueden crear.
 *              - verifyCsrfToken: requiere token CSRF (x-csrf-token).
 */
router.post(
  "/",
  authMiddleware,
  checkPermission(["Administrador"]),
  //verifyCsrfToken,
  crearZonaController
);

/**
 * PUT /zonas/:id
 * @desc Actualiza una zona existente por su ID.
 * @middlewares - authMiddleware: requiere autenticación.
 *              - checkPermission(["Administrador"]): solo administradores pueden actualizar.
 *              - verifyCsrfToken: requiere token CSRF.
 */
router.put(
  "/:id",
  authMiddleware,
  checkPermission(["Administrador"]),
  //verifyCsrfToken,
  updateZona
);

/**
 * DELETE /zonas/:id
 * @desc Elimina una zona por su ID.
 * @middlewares - authMiddleware: requiere autenticación.
 *              - checkPermission(["Administrador"]): solo administradores pueden eliminar.
 *              - verifyCsrfToken: requiere token CSRF.
 */
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(["Administrador"]),
  //verifyCsrfToken,
  deleteZona
);

export default router;
