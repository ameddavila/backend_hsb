// Importar modelos principales
import UserModel from "./user.model";
import RoleModel from "./role.model";
import PermissionModel from "./permission.model";
import MenuModel from "./menu.model";

// Importar modelos de relaciones
import UserRoleModel from "./userRole.model";
import RolePermissionModel from "./rolePermission.model";
import RoleMenuModel from "./roleMenu.model";

// Exportar los modelos principales y de relaciones
export {
  UserModel,
  RoleModel,
  PermissionModel,
  MenuModel,
  UserRoleModel,
  RolePermissionModel,
  RoleMenuModel,
};
