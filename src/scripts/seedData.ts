// src/scripts/seedData.ts

import RoleModel from "../modules/users/models/role.model";
import PermissionModel from "../modules/users/models/permission.model";
import UserModel from "../modules/users/models/user.model";
import MenuModel from "../modules/users/models/menu.model";
import bcrypt from "bcrypt";

const seedData = async () => {
  try {
    // 1. Lista de permisos
    const permissionsToCreate = [
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

    const createdPermissions = [];
    for (const perm of permissionsToCreate) {
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

    // 3. Asignar permisos
    await adminRole.addPermissions(createdPermissions);
    const userReadPermissions = createdPermissions.filter(p => p.action === "read");
    await userRole.addPermissions(userReadPermissions);

    // 4. Crear menús
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

    const [menusParent] = await MenuModel.findOrCreate({
      where: { name: "Menús" },
      defaults: {
        path: "/admin/menus",
        icon: "pi pi-list",
        parentId: adminMenu.id,
        isActive: true,
        sortOrder: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const [createMenu] = await MenuModel.findOrCreate({
      where: { name: "Crear Menú" },
      defaults: {
        path: "/admin/menus/create",
        icon: "pi pi-plus",
        parentId: menusParent.id,
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // 5. Asignar menús a roles
    await adminRole.addMenus([
      dashboardMenu,
      adminMenu,
      usersMenu,
      rolesMenu,
      permissionsMenu,
      menusParent,
      createMenu,
    ]);

    await userRole.addMenus([dashboardMenu, usersMenu]);
    await guestRole.addMenus([dashboardMenu]);

    // 6. Crear usuario administrador
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

    await adminUser.$add("roles", adminRole);

    console.log("✅ Seeder ejecutado correctamente.");
  } catch (error) {
    console.error("❌ Error al insertar datos:", error);
  }
};

export default seedData;
