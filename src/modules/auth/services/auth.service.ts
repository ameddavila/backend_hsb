import { generateAccessToken, generateRefreshToken } from "./jwt.service";
import { generateCsrfToken } from "./csrf.service";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import UserModel from "@modules/users/models/user.model";
import RoleModel from "@modules/users/models/role.model";

export const loginUser = async (
  usernameOrEmail: string,
  password: string
): Promise<
  | {
      success: true;
      accessToken: string;
      refreshToken: string;
      csrfToken: string;
    }
  | { success: false; status: number; message: string }
> => {
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

    if (!user) {
      return { success: false, status: 404, message: "Usuario no encontrado" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, status: 401, message: "Contraseña incorrecta" };
    }

    if (!user.isActive) {
      return { success: false, status: 403, message: "Usuario inactivo" };
    }

    const userRole = user.roles?.[0];
    if (!userRole) {
      return {
        success: false,
        status: 403,
        message: "El usuario no tiene roles asignados",
      };
    }

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

    return { success: true, accessToken, refreshToken, csrfToken };
  } catch (error: unknown) {
    return {
      success: false,
      status: 500,
      message: "Error en el inicio de sesión",
    };
  }
};
