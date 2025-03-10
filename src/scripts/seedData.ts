import RoleModel from "../modules/users/models/role.model";
import PermissionModel from "../modules/users/models/permission.model";

const seedData = async () => {
  try {
    // Crear permisos
    const readPermission = await PermissionModel.findOrCreate({
      where: { name: "read" },
      defaults: { description: "Permiso para leer" },
    });

    const writePermission = await PermissionModel.findOrCreate({
      where: { name: "write" },
      defaults: { description: "Permiso para escribir" },
    });

    // Crear roles
    const adminRole = await RoleModel.findOrCreate({
      where: { name: "admin" },
    });
    const userRole = await RoleModel.findOrCreate({ where: { name: "user" } });
    const guestRole = await RoleModel.findOrCreate({
      where: { name: "Invitado" },
      defaults: { description: "Rol con acceso limitado." },
    });

    // Asignar permisos a los roles
    await adminRole[0].$add("permissions", [
      readPermission[0],
      writePermission[0],
    ]);
    await userRole[0].$add("permissions", [readPermission[0]]);
    await guestRole[0].$add("permissions", []); // Invitado sin permisos por defecto

    console.log("✅ Datos iniciales insertados correctamente.");
  } catch (error) {
    console.error("❌ Error al insertar datos:", error);
  }
};

export default seedData;
