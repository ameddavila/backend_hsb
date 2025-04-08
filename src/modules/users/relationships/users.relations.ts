// src/relationships/users.relations.ts
import { Sequelize } from "sequelize-typescript";
import UserModel from "@modules/users/models/user.model";
import RoleModel from "@modules/users/models/role.model";
import PermissionModel from "@modules/users/models/permission.model";
import MenuModel from "@modules/users/models/menu.model";
import UserRoleModel from "@modules/users/models/userRole.model";
import RolePermissionModel from "@modules/users/models/rolePermission.model";
import RoleMenuModel from "@modules/users/models/roleMenu.model";

/**
 * Inicializa las relaciones entre usuarios, roles, permisos y menús.
 */
export const initializeUserRelationships = (sequelize: Sequelize): void => {
  // 👤 Usuarios ↔ Roles (Muchos a muchos)
  UserModel.belongsToMany(RoleModel, {
    through: UserRoleModel,
    foreignKey: "userId",
    otherKey: "roleId",
    as: "roles", // Usuario.getRoles()
  });

  RoleModel.belongsToMany(UserModel, {
    through: UserRoleModel,
    foreignKey: "roleId",
    otherKey: "userId",
    as: "users", // Rol.getUsers()
  });

  // 🔐 Roles ↔ Permisos (Muchos a muchos)
  RoleModel.belongsToMany(PermissionModel, {
    through: RolePermissionModel,
    foreignKey: "roleId",
    otherKey: "permissionId",
    as: "permissions", // Rol.getPermissions()
  });

  PermissionModel.belongsToMany(RoleModel, {
    through: RolePermissionModel,
    foreignKey: "permissionId",
    otherKey: "roleId",
    as: "rolesWithThisPermission", // 🔁 Alias cambiado para evitar conflicto
  });

  // 📋 Roles ↔ Menús (Muchos a muchos)
  RoleModel.belongsToMany(MenuModel, {
    through: RoleMenuModel,
    foreignKey: "roleId",
    otherKey: "menuId",
    as: "menus", // Rol.getMenus()
  });

  MenuModel.belongsToMany(RoleModel, {
    through: RoleMenuModel,
    foreignKey: "menuId",
    otherKey: "roleId",
    as: "rolesWithAccessToThisMenu", // 🔁 Alias cambiado
  });
};
