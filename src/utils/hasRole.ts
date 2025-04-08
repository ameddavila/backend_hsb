// src/utils/hasRole.ts

import { RequestWithUser } from "@modules/auth/types/requestWithUser";

/**
 * Verifica si el usuario tiene uno de los roles permitidos.
 * 
 * @param req - Request extendida con información del usuario autenticado.
 * @param allowedRoles - Rol o lista de roles permitidos (case-insensitive).
 * @returns true si el usuario tiene un rol permitido.
 */
export function hasRole(
  req: RequestWithUser,
  allowedRoles: string | string[]
): boolean {
  const roleName = req.user?.roleName;
  if (!roleName) return false;

  const userRole = roleName.trim().toLowerCase();
  const allowed = Array.isArray(allowedRoles)
    ? allowedRoles.map((r) => r.trim().toLowerCase())
    : [allowedRoles.trim().toLowerCase()];

  return allowed.includes(userRole);
}
