// src/utils/hasRole.ts

import { RequestWithUser } from "@modules/auth/types/requestWithUser";

/**
 * Verifica si el usuario tiene uno de los roles permitidos.
 * @param req Request extendida con usuario autenticado
 * @param allowedRoles Rol o lista de roles
 */
export function hasRole(
  req: RequestWithUser,
  allowedRoles: string | string[]
): boolean {
  if (!req.user?.roleName) return false;

  const userRole = req.user.roleName.trim().toLowerCase();
  const allowed = Array.isArray(allowedRoles)
    ? allowedRoles.map((r) => r.trim().toLowerCase())
    : [allowedRoles.trim().toLowerCase()];

  return allowed.includes(userRole);
}
