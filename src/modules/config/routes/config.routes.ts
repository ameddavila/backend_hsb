// src/modules/config/routes/config.routes.ts

import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove
} from "@modules/config/controllers/dbConnection.controller";

import { authMiddleware } from "@middleware/auth.middleware";
import { checkPermission } from "@middleware/permission.middleware";
import { verifyCsrfToken } from "@modules/auth/middleware/csrf.middleware";

const router = Router();

/**
 * GET /config
 * @desc Lista todas las conexiones configuradas. 
 *       Solo accesible a usuarios con rol "Administrador".
 */
router.get(
  "/",
  authMiddleware,
  checkPermission(["Administrador"]),
  getAll
);

/**
 * GET /config/:id
 * @desc Obtiene los detalles de una conexión por ID. 
 *       Solo accesible a usuarios con rol "Administrador".
 */
router.get(
  "/:id",
  authMiddleware,
  checkPermission(["Administrador"]),
  getById
);

/**
 * POST /config
 * @desc Crea una nueva configuración de conexión remota. 
 *       Solo accesible al rol "Administrador".
 */
router.post(
  "/",
  authMiddleware,
  checkPermission(["Administrador"]),
  // verifyCsrfToken, // ✅ Habilita si deseas validación CSRF para POST
  create
);

/**
 * PUT /config/:id
 * @desc Actualiza una configuración existente por su ID. 
 *       Solo accesible al rol "Administrador".
 */
router.put(
  "/:id",
  authMiddleware,
  checkPermission(["Administrador"]),
  // verifyCsrfToken,
  update
);

/**
 * DELETE /config/:id
 * @desc Elimina una conexión remota existente por ID. 
 *       Solo accesible al rol "Administrador".
 */
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(["Administrador"]),
  // verifyCsrfToken,
  remove
);

export default router;
