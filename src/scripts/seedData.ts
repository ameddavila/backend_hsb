import bcrypt from "bcrypt";
import RoleModel from "../modules/users/models/role.model";
import PermissionModel from "../modules/users/models/permission.model";
import MenuModel from "../modules/users/models/menu.model";
import UserModel from "../modules/users/models/user.model";
import DbConnectionModel from "@modules/config/models/dbConnection.model";


const seedData = async () => {
  try {
    console.log("🌱 Iniciando seeder...");

    // 1. Crear permisos
    const permissionList = [
      { module: "Users", action: "read" },
      { module: "Users", action: "create" },
      { module: "Users", action: "edit" },
      { module: "Users", action: "delete" },
      { module: "Roles", action: "read" },
      { module: "Roles", action: "create" },
      { module: "Roles", action: "edit" },
      { module: "Roles", action: "delete" },
      { module: "Permissions", action: "read" },
      { module: "Permissions", action: "create" },
      { module: "Permissions", action: "edit" },
      { module: "Permissions", action: "delete" },
      { module: "Menus", action: "read" },
      { module: "Menus", action: "create" },
      { module: "Menus", action: "edit" },
      { module: "Menus", action: "delete" },
    ];

    const createdPermissions: PermissionModel[] = [];

    for (const perm of permissionList) {
      const [permission] = await PermissionModel.findOrCreate({
        where: { module: perm.module, action: perm.action },
        defaults: {
          name: `${perm.module} ${perm.action}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      createdPermissions.push(permission);
    }

    // 2. Crear roles
    const [adminRole] = await RoleModel.findOrCreate({
      where: { name: "Administrador" },
      defaults: {
        description: "Rol con acceso completo",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const [userRole] = await RoleModel.findOrCreate({
      where: { name: "Usuario" },
      defaults: {
        description: "Rol estándar",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const [guestRole] = await RoleModel.findOrCreate({
      where: { name: "Invitado" },
      defaults: {
        description: "Rol con acceso mínimo",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // 3. Asignar permisos a roles
    await (adminRole as any).$set("permisos", createdPermissions);
    await (userRole as any).$set(
      "permisos",
      createdPermissions.filter((p) => p.action === "read")
    );

    // 4. Crear menús jerárquicos
    const menuData = [
      { name: "Dashboard", path: "/dashboard", icon: "pi pi-home", parentName: null, sortOrder: 1 },
      { name: "Administración", path: "/admin", icon: "pi pi-cog", parentName: null, sortOrder: 2 },
      { name: "Usuarios", path: "/admin/users", icon: "pi pi-users", parentName: "Administración", sortOrder: 1 },
      { name: "Roles", path: "/admin/roles", icon: "pi pi-id-card", parentName: "Administración", sortOrder: 2 },
      { name: "Permisos", path: "/admin/permissions", icon: "pi pi-key", parentName: "Administración", sortOrder: 3 },
      { name: "Menús", path: "/admin/menus", icon: "pi pi-list", parentName: "Administración", sortOrder: 4 },
      { name: "Crear Menú", path: "/admin/menus/create", icon: "pi pi-plus", parentName: "Menús", sortOrder: 1 },
      { name: "Biometricos", path: "/biometrico", icon: "pi pi-plus", parentName: "Administración", sortOrder: 1 },
      { name: "Zonas", path: "/biometrico/zonas", icon: "pi pi-plus", parentName: "Biometricos", sortOrder: 1 },
      { name: "Nueva Zona", path: "/biometrico/zonas/create", icon: "pi pi-plus", parentName: "Zonas", sortOrder: 1 },
    ];

    const menuInstances: Record<string, MenuModel> = {};

    for (const item of menuData) {
      const parentId = item.parentName ? menuInstances[item.parentName]?.id || null : null;

      const [menu] = await MenuModel.findOrCreate({
        where: { name: item.name },
        defaults: {
          path: item.path,
          icon: item.icon,
          parentId,
          isActive: true,
          sortOrder: item.sortOrder,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      menuInstances[item.name] = menu;
    }

    // 5. Asignar menús a roles
    await (adminRole as any).$set("menus", Object.values(menuInstances));
    await (userRole as any).$set("menus", [
      menuInstances["Dashboard"],
      menuInstances["Usuarios"],
    ].filter(Boolean));
    await (guestRole as any).$set("menus", [
      menuInstances["Dashboard"],
    ].filter(Boolean));

    // 6. Crear usuario administrador
    const passwordHash = await bcrypt.hash("Admin1234!", 10);

    const [adminUser] = await UserModel.findOrCreate({
      where: { email: "amed.dav@gmail.com" },
      defaults: {
        username: "amed.dav",
        password: passwordHash,
        firstName: "Amed",
        lastName: "Davila",
        phone: "123456789",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await adminUser.$add("roles", adminRole);
    // 7. Insertar configuración estándar en config_Connections
    const [defaultConnection] = await DbConnectionModel.findOrCreate({
      where: { nombre: "Conexión Principal" },
      defaults: {
        nombre: "Conexión Principal",
        descripcion: "Conexión estándar a base biométrica local",
        servidor: "localhost",
        puerto: 1433,
        usuario: "sa",
        contrasena: "123456",
        baseDatos: "dbBiometrico1",
        ssl: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("🔌 Conexión estándar creada:", defaultConnection.nombre);

    
    console.log("✅ Seeder ejecutado correctamente.");
  } catch (error) {
    console.error("❌ Error al ejecutar el seeder:", error);
  }
};

export default seedData;
