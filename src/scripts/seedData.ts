import RoleModel from "../modules/users/models/role.model";
import PermissionModel from "../modules/users/models/permission.model";
import UserModel from "../modules/users/models/user.model";
import UserRoleModel from "../modules/users/models/userRole.model";
import MenuModel from "../modules/users/models/menu.model"; // Ajusta la ruta según tu proyecto
import bcrypt from "bcrypt";

const seedData = async () => {
  try {
    // ============================================
    // 1. DEFINIR LISTA DE PERMISOS
    // ============================================
    // Incluimos todas las acciones para varios módulos.
    const permissionsToCreate = [
      // Módulo Users
      { module: "Users", action: "read" },
      { module: "Users", action: "create" },
      { module: "Users", action: "edit" },
      { module: "Users", action: "delete" },

      // Módulo Roles
      { module: "Roles", action: "read" },
      { module: "Roles", action: "create" },
      { module: "Roles", action: "edit" },
      { module: "Roles", action: "delete" },

      // Módulo Permissions
      { module: "Permissions", action: "read" },
      { module: "Permissions", action: "create" },
      { module: "Permissions", action: "edit" },
      { module: "Permissions", action: "delete" },

      // Módulo Menus (para poder leer, crear, editar, eliminar menús)
      { module: "Menus", action: "read" },
      { module: "Menus", action: "create" },
      { module: "Menus", action: "edit" },
      { module: "Menus", action: "delete" },
    ];

    // ============================================
    // 2. CREAR (O BUSCAR) PERMISOS EN LA TABLA
    // ============================================
    const createdPermissions = [];
    for (const perm of permissionsToCreate) {
      const [permission] = await PermissionModel.findOrCreate({
        where: { module: perm.module, action: perm.action },
        defaults: {
          // Le damos un nombre descriptivo (por ejemplo, "Users read")
          name: `${perm.module} ${perm.action}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      createdPermissions.push(permission);
    }

    // ============================================
    // 3. CREAR ROLES
    // ============================================
    const [adminRole] = await RoleModel.findOrCreate({
      where: { name: "Administrador" },
      defaults: {
        description: "Rol de administrador con todos los permisos",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const [userRole] = await RoleModel.findOrCreate({
      where: { name: "Usuario" },
      defaults: {
        description: "Rol de usuario con permisos limitados",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const [guestRole] = await RoleModel.findOrCreate({
      where: { name: "Invitado" },
      defaults: {
        description: "Rol con acceso limitado",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // ============================================
    // 4. ASIGNAR PERMISOS A LOS ROLES
    // ============================================
    // (A) Administrador -> todos los permisos
    await adminRole.$add("permissions", createdPermissions);

    // (B) Usuario -> solo permisos "read" (puedes ajustarlo)
    const userReadPermissions = createdPermissions.filter(
      (p) => p.action === "read"
    );
    await userRole.$add("permissions", userReadPermissions);

    // (C) Invitado -> podría no tener permisos, o solo lectura de algún módulo
    // Ejemplo: invitado sin permisos
    // await guestRole.$add("permissions", []);

    // ============================================
    // 5. CREAR MENÚS (PRIMEICONS)
    // ============================================
    // Ejemplos: Dashboard, Administración, Usuarios, Roles, Permisos.
    const [dashboardMenu] = await MenuModel.findOrCreate({
      where: { name: "Dashboard" },
      defaults: {
        path: "/dashboard",
        icon: "pi pi-home",
        parentId: null,
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const [adminMenu] = await MenuModel.findOrCreate({
      where: { name: "Administración" },
      defaults: {
        path: "/admin",
        icon: "pi pi-cog",
        parentId: null,
        isActive: true,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const [usersMenu] = await MenuModel.findOrCreate({
      where: { name: "Usuarios" },
      defaults: {
        path: "/admin/users",
        icon: "pi pi-users",
        parentId: adminMenu.id,
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const [rolesMenu] = await MenuModel.findOrCreate({
      where: { name: "Roles" },
      defaults: {
        path: "/admin/roles",
        icon: "pi pi-id-card",
        parentId: adminMenu.id,
        isActive: true,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const [permissionsMenu] = await MenuModel.findOrCreate({
      where: { name: "Permisos" },
      defaults: {
        path: "/admin/permissions",
        icon: "pi pi-key",
        parentId: adminMenu.id,
        isActive: true,
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // ============================================
    // 5.a MENÚ PARA ADMINISTRAR MENÚS
    // ============================================
    // Sección principal: "Menús"
    const [menusParent] = await MenuModel.findOrCreate({
      where: { name: "Menús" },
      defaults: {
        path: "/admin/menus",
        icon: "pi pi-list", // Lista de menús
        parentId: adminMenu.id, // Hijo de "Administración"
        isActive: true,
        sortOrder: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Submenú para “Crear Menú”
    const [createMenu] = await MenuModel.findOrCreate({
      where: { name: "Crear Menú" },
      defaults: {
        path: "/admin/menus/create",
        icon: "pi pi-plus", // Ícono para crear
        parentId: menusParent.id, // Hijo del menú “Menús”
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // ============================================
    // 6. ASIGNAR MENÚS A LOS ROLES
    // ============================================
    // Depende de tu config de Sequelize (belongsToMany).
    // Administrador -> todos los menús
    await adminRole.$add("menus", [
      dashboardMenu,
      adminMenu,
      usersMenu,
      rolesMenu,
      permissionsMenu,
      menusParent,
      createMenu,
    ]);

    // Usuario -> solo Dashboard y Usuarios (ajusta a tu gusto)
    await userRole.$add("menus", [dashboardMenu, usersMenu]);

    // Invitado -> solo Dashboard (ejemplo)
    await guestRole.$add("menus", [dashboardMenu]);

    // ============================================
    // 7. CREAR USUARIO ADMINISTRADOR INICIAL
    // ============================================
    const passwordHash = await bcrypt.hash("Admin1234!", 10);
    const [adminUser] = await UserModel.findOrCreate({
      where: { email: "amed.dav@gmail.com" },
      defaults: {
        username: "amed.dav",
        email: "amed.dav@gmail.com",
        password: passwordHash,
        firstName: "Amed",
        lastName: "Davila",
        phone: "123456789",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // ============================================
    // 8. ASIGNAR ROLES AL USUARIO
    // ============================================
    await UserRoleModel.findOrCreate({
      where: { userId: adminUser.id, roleId: adminRole.id },
      defaults: { createdAt: new Date(), updatedAt: new Date() },
    });

    console.log("✅ Seeder ejecutado correctamente.");
  } catch (error) {
    console.error("❌ Error al insertar datos:", error);
  }
};

export default seedData;
