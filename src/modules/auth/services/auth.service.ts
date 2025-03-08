import { generateAccessToken, generateRefreshToken } from "./jwt.service";
import { generateCsrfToken } from "./csrf.service";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import UserModel from "@modules/users/models/user.model";
import RoleModel from "@modules/users/models/role.model";

export const loginUser = async (
  usernameOrEmail: string,
  password: string
): Promise<{
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
}> => {
  try {
    const user = await UserModel.findOne({
      where: {
        [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
      include: [
        {
          model: RoleModel,
          as: "roles",
          through: { attributes: [] },
        },
      ],
    });

    if (!user) throw new Error("Usuario no encontrado");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Contraseña incorrecta");

    const userRole = user.roles?.[0];
    if (!userRole) throw new Error("El usuario no tiene roles asignados");

    if (!user.isActive) throw new Error("Usuario inactivo");

    // Generar tokens correctamente
    const accessToken = generateAccessToken({
      userId: user.id,
      roleId: userRole.id,
      roleName: userRole.name,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      roleId: userRole.id,
      roleName: userRole.name,
    });

    const csrfToken = generateCsrfToken(user.id);

    return { accessToken, refreshToken, csrfToken };
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Error en el inicio de sesión"
    );
  }
};
