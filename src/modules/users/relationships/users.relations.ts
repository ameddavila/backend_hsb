// ✅ FILE: src/modules/users/relationships/users.relations.ts
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
  // Usuario ↔ Rol
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

  // Rol ↔ Permiso
  RoleModel.belongsToMany(PermissionModel, {
    through: RolePermissionModel,
    foreignKey: "roleId",
    otherKey: "permissionId",
    as: "permisos", // Alias personalizado
  });

  PermissionModel.belongsToMany(RoleModel, {
    through: RolePermissionModel,
    foreignKey: "permissionId",
    otherKey: "roleId",
    as: "rolesConEstePermiso",
  });

  // Rol ↔ Menú
  RoleModel.belongsToMany(MenuModel, {
    through: RoleMenuModel,
    foreignKey: "roleId",
    otherKey: "menuId",
    as: "menus",
  });

  MenuModel.belongsToMany(RoleModel, {
    through: RoleMenuModel,
    foreignKey: "menuId",
    otherKey: "roleId",
    as: "rolesConAcceso",
  });
};