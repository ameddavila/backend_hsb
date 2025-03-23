
import { Request } from "express";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import UserModel from "@modules/users/models/user.model";
import RoleModel from "@modules/users/models/role.model";
import { generateAccessToken, generateRefreshToken } from "./jwt.service";
import { generateCsrfToken } from "./csrf.service";
import { LoginResult, LoginSuccess, LoginFailure } from "../types/auth.types";

export const loginUser = async (
  usernameOrEmail: string,
  password: string,
  req: Request
): Promise<LoginResult> => {
  try {
    // 1. Buscar usuario por username o email
    const user = await UserModel.findOne({
      where: {
        [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
      include: [
        {
          model: RoleModel,
          as: "roles",
          through: { attributes: [] }, // Omitimos tabla intermedia
        },
      ],
    });

    if (!user) {
      return {
        success: false,
        status: 404,
        message: "Usuario no encontrado",
      };
    }

    // 2. Validar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        status: 401,
        message: "Contraseña incorrecta",
      };
    }

    // 3. Verificar si el usuario está activo
    if (!user.isActive) {
      return {
        success: false,
        status: 403,
        message: "Usuario inactivo",
      };
    }

    // 4. Validar que tenga al menos un rol asignado
    const userRole = user.roles?.[0];
    if (!userRole) {
      return {
        success: false,
        status: 403,
        message: "El usuario no tiene roles asignados",
      };
    }

    // 5. Generar tokens de acceso, refresh y CSRF
    const accessToken = generateAccessToken({
      userId: user.id,
      roleId: userRole.id,
      roleName: userRole.name,
    });

    const refreshToken = generateRefreshToken({ userId: user.id });
    const csrfToken = generateCsrfToken(user.id);

    // 6. Retornar datos de sesión exitosamente
    const success: LoginSuccess = {
      success: true,
      userId: user.id,
      username: user.username,
      email: user.email,
      userRole: userRole.name,
      accessToken,
      refreshToken,
      csrfToken,
    };

    return success;

  } catch (error) {
    console.error("❌ Error en loginUser:", error);
    return {
      success: false,
      status: 500,
      message: "Error interno en loginUser",
    };
  }
};
