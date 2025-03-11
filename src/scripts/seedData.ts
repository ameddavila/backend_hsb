import RoleModel from "../modules/users/models/role.model";
import PermissionModel from "../modules/users/models/permission.model";
import UserModel from "../modules/users/models/user.model";
import UserRoleModel from "../modules/users/models/userRole.model";
import bcrypt from "bcrypt";

const seedData = async () => {
  try {
    // 🔹 Crear permisos con "module" y "action"
    const readPermission = await PermissionModel.findOrCreate({
      where: { module: "general", action: "read" },
      defaults: { createdAt: new Date(), updatedAt: new Date() },
    });

    const writePermission = await PermissionModel.findOrCreate({
      where: { module: "general", action: "write" },
      defaults: { createdAt: new Date(), updatedAt: new Date() },
    });

    // 🔹 Crear roles
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

    // 🔹 Asignar permisos a los roles
    await adminRole.$add("permissions", [
      readPermission[0],
      writePermission[0],
    ]);
    await userRole.$add("permissions", [readPermission[0]]);
    await guestRole.$add("permissions", []);

    // 🔹 Crear un usuario inicial
    const passwordHash = await bcrypt.hash("Admin1234!", 10); // 🔒 Contraseña segura
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

    // 🔹 Asignar el usuario a los roles
    await UserRoleModel.findOrCreate({
      where: { userId: adminUser.id, roleId: adminRole.id },
      defaults: { createdAt: new Date(), updatedAt: new Date() },
    });

    await UserRoleModel.findOrCreate({
      where: { userId: adminUser.id, roleId: guestRole.id },
      defaults: { createdAt: new Date(), updatedAt: new Date() },
    });

    console.log("✅ Seeder ejecutado correctamente.");
  } catch (error) {
    console.error("❌ Error al insertar datos:", error);
  }
};

export default seedData;
