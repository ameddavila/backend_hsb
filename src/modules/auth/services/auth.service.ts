import { Request } from "express";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import UserModel from "@modules/users/models/user.model";
import RoleModel from "@modules/users/models/role.model";
import { generateAccessToken, generateRefreshToken } from "./jwt.service";
import { generateCsrfToken } from "./csrf.service";
import RefreshTokenModel from "../models/refreshToken.model";
import { LoginResult, LoginSuccess, LoginFailure } from "../types/auth.types";

export const loginUser = async (
  usernameOrEmail: string,
  password: string,
  req: Request
): Promise<LoginResult> => {
  try {
    // 1. Buscar usuario
    const user = await UserModel.findOne({
      where: {
        [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
      include: [{ model: RoleModel, as: "roles", through: { attributes: [] } }],
    });

    if (!user) {
      const fail: LoginFailure = {
        success: false,
        status: 404,
        message: "Usuario no encontrado",
      };
      return fail;
    }

    // 2. Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const fail: LoginFailure = {
        success: false,
        status: 401,
        message: "Contraseña incorrecta",
      };
      return fail;
    }

    // 3. Verificar si está activo
    if (!user.isActive) {
      const fail: LoginFailure = {
        success: false,
        status: 403,
        message: "Usuario inactivo",
      };
      return fail;
    }

    // 4. Verificar roles
    const userRole = user.roles?.[0];
    if (!userRole) {
      const fail: LoginFailure = {
        success: false,
        status: 403,
        message: "El usuario no tiene roles asignados",
      };
      return fail;
    }

    // 5. Generar tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      roleId: userRole.id,
      roleName: userRole.name,
    });
    const refreshToken = generateRefreshToken({ userId: user.id });
    const csrfToken = generateCsrfToken(user.id);

    // 6. Retornar objeto de ÉXITO
    const success: LoginSuccess = {
      success: true,
      userId: user.id,
      accessToken,
      refreshToken,
      csrfToken,
    };
    return success;
  } catch (error) {
    console.error("❌ Error en loginUser:", error);

    // O puedes retornar un error genérico
    const fail: LoginFailure = {
      success: false,
      status: 500,
      message: "Error interno en loginUser",
    };
    return fail;
  }
};
