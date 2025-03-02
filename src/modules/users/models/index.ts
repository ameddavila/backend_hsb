// Importar modelos principales
import UserModel from "@modules/users/models/user.model";
import RoleModel from "@modules/users/models/role.model";
import PermissionModel from "@modules/users/models/permission.model";
import MenuModel from "@modules/users/models/menu.model";

// Importar modelos de relaciones
import UserRoleModel from "@modules/users/models/userRole.model";
import RolePermissionModel from "@modules/users/models/rolePermission.model";
import RoleMenuModel from "@modules/users/models/roleMenu.model";

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
