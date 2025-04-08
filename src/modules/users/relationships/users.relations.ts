// src/relationships/users.relations.ts
import { Sequelize } from "sequelize-typescript";
import {
  UserModel,
  RoleModel,
  PermissionModel,
  MenuModel,
  UserRoleModel,
  RolePermissionModel,
  RoleMenuModel,
} from "@modules/users/models";

export const initializeUserRelationships = (sequelize: Sequelize): void => {
  // 👤 Usuario ↔ Rol
  UserModel.belongsToMany(RoleModel, {
    through: UserRoleModel,
    foreignKey: "userId",
    otherKey: "roleId",
    as: "roles",
  });

  RoleModel.belongsToMany(UserModel, {
    through: UserRoleModel,
    foreignKey: "roleId",
    otherKey: "userId",
    as: "users",
  });

  // 🔐 Rol ↔ Permiso (evita duplicados de alias)
  RoleModel.belongsToMany(PermissionModel, {
    through: RolePermissionModel,
    foreignKey: "roleId",
    otherKey: "permissionId",
    as: "permisos", // ✅ Alias personalizado (no "permissions")
  });

  PermissionModel.belongsToMany(RoleModel, {
    through: RolePermissionModel,
    foreignKey: "permissionId",
    otherKey: "roleId",
    as: "rolesConEstePermiso", // ✅ Alias único
  });

  // 📋 Rol ↔ Menú
  RoleModel.belongsToMany(MenuModel, {
    through: RoleMenuModel,
    foreignKey: "roleId",
    otherKey: "menuId",
    as: "menus", // ✅ Alias OK
  });

  MenuModel.belongsToMany(RoleModel, {
    through: RoleMenuModel,
    foreignKey: "menuId",
    otherKey: "roleId",
    as: "rolesConAcceso", // ✅ Alias único
  });
};
