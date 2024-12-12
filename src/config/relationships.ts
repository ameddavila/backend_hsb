import {
  UserModel,
  RoleModel,
  PermissionModel,
  MenuModel,
  UserRoleModel,
  RolePermissionModel,
  RoleMenuModel,
} from "../modules/users/models";

export const initializeRelationships = () => {
  console.log("✅ Inicializando relaciones...");

  try {
    // Relación entre Usuarios y Roles (N:N) mediante UserRoles
    UserRoleModel.belongsTo(UserModel, {
      foreignKey: "userId",
      as: "userDetail", // Alias único
    });
    UserRoleModel.belongsTo(RoleModel, {
      foreignKey: "roleId",
      as: "roleDetail", // Alias único
    });
    UserModel.hasMany(UserRoleModel, {
      foreignKey: "userId",
      as: "userRolesAssociation", // Alias único
    });
    RoleModel.hasMany(UserRoleModel, {
      foreignKey: "roleId",
      as: "roleUserAssociation", // Alias único
    });

    // Relación entre Roles y Menús (N:N) mediante RoleMenus
    RoleMenuModel.belongsTo(RoleModel, {
      foreignKey: "roleId",
      as: "roleMenuDetail", // Alias único
    });
    RoleMenuModel.belongsTo(MenuModel, {
      foreignKey: "menuId",
      as: "menuRoleDetail", // Alias único
    });
    RoleModel.hasMany(RoleMenuModel, {
      foreignKey: "roleId",
      as: "roleMenusAssociation", // Alias único
    });
    MenuModel.hasMany(RoleMenuModel, {
      foreignKey: "menuId",
      as: "menuRolesAssociation", // Alias único
    });

    // Relación entre Roles y Permisos (N:N) mediante RolePermissions
    RolePermissionModel.belongsTo(RoleModel, {
      foreignKey: "roleId",
      as: "rolePermissionDetail", // Alias único
    });
    RolePermissionModel.belongsTo(PermissionModel, {
      foreignKey: "permissionId",
      as: "permissionRoleDetail", // Alias único
    });
    RoleModel.hasMany(RolePermissionModel, {
      foreignKey: "roleId",
      as: "rolePermissionsAssociation", // Alias único
    });
    PermissionModel.hasMany(RolePermissionModel, {
      foreignKey: "permissionId",
      as: "permissionRolesAssociation", // Alias único
    });

    console.log("✅ Relaciones inicializadas correctamente.");
  } catch (error) {
    console.error("❌ Error al inicializar relaciones:", error);
    process.exit(1);
  }
};
