// src/relationships/relationships.ts
import UserModel from "@modules/users/models/user.model";
import RoleModel from "@modules/users/models/role.model";
import PermissionModel from "@modules/users/models/permission.model";
import MenuModel from "@modules/users/models/menu.model";
import UserRoleModel from "@modules/users/models/userRole.model";
import RolePermissionModel from "@modules/users/models/rolePermission.model";
import RoleMenuModel from "@modules/users/models/roleMenu.model";

export const initializeRelationships = (): void => {
  // Usuarios ↔ Roles (Muchos a muchos)
  UserModel.belongsToMany(RoleModel, {
    through: UserRoleModel,
    foreignKey: "userId",
    otherKey: "roleId",
    as: "roles", // Al consultar un usuario, se obtienen sus roles en "roles"
  });
  RoleModel.belongsToMany(UserModel, {
    through: UserRoleModel,
    foreignKey: "roleId",
    otherKey: "userId",
    as: "users", // Al consultar un rol, se obtienen los usuarios en "users"
  });

  // Roles ↔ Permisos (Muchos a muchos)
  RoleModel.belongsToMany(PermissionModel, {
    through: RolePermissionModel,
    foreignKey: "roleId",
    otherKey: "permissionId",
    as: "permissions", // Un rol tendrá sus permisos en "permissions"
  });
  PermissionModel.belongsToMany(RoleModel, {
    through: RolePermissionModel,
    foreignKey: "permissionId",
    otherKey: "roleId",
    as: "roles", // Un permiso tendrá sus roles asociados en "roles"
  });

  // Roles ↔ Menús (Muchos a muchos)
  RoleModel.belongsToMany(MenuModel, {
    through: RoleMenuModel,
    foreignKey: "roleId",
    otherKey: "menuId",
    as: "menus", // Un rol tendrá los menús asignados en "menus"
  });
  MenuModel.belongsToMany(RoleModel, {
    through: RoleMenuModel,
    foreignKey: "menuId",
    otherKey: "roleId",
    as: "roles", // Un menú tendrá los roles asociados en "roles"
  });
};
