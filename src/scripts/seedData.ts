import RoleModel from "../modules/users/models/role.model";
import PermissionModel from "../modules/users/models/permission.model";

const seedData = async () => {
  try {
    const readPermission = await PermissionModel.create({
      name: "read",
      description: "Permiso para leer",
    });
    const writePermission = await PermissionModel.create({
      name: "write",
      description: "Permiso para escribir",
    });

    const adminRole = await RoleModel.create({ name: "admin" });
    const userRole = await RoleModel.create({ name: "user" });

    await adminRole.$add("permissions", [readPermission, writePermission]);
    await userRole.$add("permissions", [readPermission]);

    console.log("Datos iniciales insertados correctamente.");
  } catch (error) {
    console.error("Error al insertar datos:", error);
  }
};

seedData();
