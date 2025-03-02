import RoleModel from "../modules/users/models/role.model";
import PermissionModel from "../modules/users/models/permission.model";
import RolePermissionModel from "../modules/users/models/rolePermission.model";
import MenuModel from "../modules/users/models/menu.model";
import RoleMenuModel from "../modules/users/models/roleMenu.model";

// Eliminamos las asociaciones Usuarios ↔ Roles, ya que ya están definidas en los modelos.

export const initializeRelationships = (): void => {
  // Relación muchos a muchos: Roles ↔ Permisos
  RoleModel.belongsToMany(PermissionModel, {
    through: RolePermissionModel,
    foreignKey: "roleId",
    otherKey: "permissionId",
    as: "permissions", // Un rol tendrá la propiedad "permissions"
  });

  PermissionModel.belongsToMany(RoleModel, {
    through: RolePermissionModel,
    foreignKey: "permissionId",
    otherKey: "roleId",
    as: "linkedRoles", // Un permiso tendrá la propiedad "linkedRoles"
  });

  // Relación muchos a muchos: Roles ↔ Menús
  RoleModel.belongsToMany(MenuModel, {
    through: RoleMenuModel,
    foreignKey: "roleId",
    otherKey: "menuId",
    as: "menus", // Un rol tendrá la propiedad "menus"
  });

  MenuModel.belongsToMany(RoleModel, {
    through: RoleMenuModel,
    foreignKey: "menuId",
    otherKey: "roleId",
    as: "menuRoles", // Un menú tendrá la propiedad "menuRoles"
  });
};
