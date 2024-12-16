import RoleModel from "../modules/users/models/role.model";
import PermissionModel from "../modules/users/models/permission.model";
import RolePermissionModel from "../modules/users/models/rolePermission.model";
import UserModel from "../modules/users/models/user.model";
import UserRoleModel from "../modules/users/models/userRole.model";
import MenuModel from "../modules/users/models/menu.model";
import RoleMenuModel from "../modules/users/models/roleMenu.model";

export const initializeRelationships = (): void => {
  // Relación muchos a muchos: Roles ↔ Permisos
  RoleModel.belongsToMany(PermissionModel, {
    through: RolePermissionModel,
    foreignKey: "roleId",
    otherKey: "permissionId",
    as: "permissions", // Alias único para Roles ↔ Permisos
  });

  PermissionModel.belongsToMany(RoleModel, {
    through: RolePermissionModel,
    foreignKey: "permissionId",
    otherKey: "roleId",
    as: "linkedRoles", // Alias único para Permisos ↔ Roles
  });

  // Relación muchos a muchos: Usuarios ↔ Roles
  UserModel.belongsToMany(RoleModel, {
    through: UserRoleModel,
    foreignKey: "userId",
    otherKey: "roleId",
    as: "userRoles", // Alias único para Usuarios ↔ Roles
  });

  RoleModel.belongsToMany(UserModel, {
    through: UserRoleModel,
    foreignKey: "roleId",
    otherKey: "userId",
    as: "assignedUsers", // Alias único para Roles ↔ Usuarios
  });

  // Relación muchos a muchos: Roles ↔ Menús
  RoleModel.belongsToMany(MenuModel, {
    through: RoleMenuModel,
    foreignKey: "roleId",
    otherKey: "menuId",
    as: "roleLinkedMenus", // Alias único para Roles ↔ Menús
  });

  MenuModel.belongsToMany(RoleModel, {
    through: RoleMenuModel,
    foreignKey: "menuId",
    otherKey: "roleId",
    as: "menuLinkedRoles", // Alias único para Menús ↔ Roles
  });
};
