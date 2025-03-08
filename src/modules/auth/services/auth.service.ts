import { generateAccessToken, generateRefreshToken } from "./jwt.service";
import { generateCsrfToken } from "./csrf.service";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import UserModel from "@modules/users/models/user.model";
import RoleModel from "@modules/users/models/role.model";
import RefreshTokenModel from "../models/refreshToken.model";

export const loginUser = async (usernameOrEmail: string, password: string) => {
  try {
    const user = await UserModel.findOne({
      where: {
        [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
      include: [{ model: RoleModel, as: "roles", through: { attributes: [] } }],
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

    // ✅ Generar tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      roleId: userRole.id,
      roleName: userRole.name,
    });
    const refreshToken = generateRefreshToken({ userId: user.id });

    // ✅ Guardar `refreshToken` en la base de datos
    await RefreshTokenModel.create({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      isActive: true,
    });

    const csrfToken = generateCsrfToken(user.id);

    return { success: true, accessToken, refreshToken, csrfToken };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "Error en el inicio de sesión",
    };
  }
};
