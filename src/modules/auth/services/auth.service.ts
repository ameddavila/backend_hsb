import { Request } from "express";
import { generateAccessToken, generateRefreshToken } from "./jwt.service";
import { generateCsrfToken } from "./csrf.service";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import UserModel from "@modules/users/models/user.model";
import RoleModel from "@modules/users/models/role.model";
import RefreshTokenModel from "../models/refreshToken.model";

export const loginUser = async (
  usernameOrEmail: string,
  password: string,
  req: Request // ✅ Agregamos el tercer parámetro
) => {
  try {
    console.log("🔍 Buscando usuario:", usernameOrEmail);

    const user = await UserModel.findOne({
      where: {
        [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
      include: [{ model: RoleModel, as: "roles", through: { attributes: [] } }],
    });

    if (!user) {
      console.error("🚨 Usuario no encontrado.");
      return { success: false, status: 404, message: "Usuario no encontrado" };
    }

    console.log("✅ Usuario encontrado:", user.username);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error("🚨 Contraseña incorrecta.");
      return { success: false, status: 401, message: "Contraseña incorrecta" };
    }

    console.log("✅ Contraseña correcta.");

    if (!user.isActive) {
      console.error("🚨 Usuario inactivo.");
      return { success: false, status: 403, message: "Usuario inactivo" };
    }

    const userRole = user.roles?.[0];
    if (!userRole) {
      console.error("🚨 Usuario sin rol asignado.");
      return {
        success: false,
        status: 403,
        message: "El usuario no tiene roles asignados",
      };
    }

    console.log("✅ Usuario con rol:", userRole.name);

    // ✅ Generar tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      roleId: userRole.id,
      roleName: userRole.name,
    });

    const refreshToken = generateRefreshToken({ userId: user.id });

    console.log("✅ Tokens generados correctamente.");

    // ✅ Guardar `refreshToken` en la base de datos
    try {
      await RefreshTokenModel.create({
        userId: user.id,
        token: refreshToken,
        deviceId: "Thunder Client", // Asegúrate de enviar deviceId correctamente
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: true,
      });
      console.log("✅ Refresh Token guardado correctamente en la BD.");
    } catch (dbError) {
      console.error("❌ Error al guardar el Refresh Token en la BD:", dbError);
      return {
        success: false,
        status: 500,
        message: "Error al guardar el token en la base de datos",
      };
    }

    const csrfToken = generateCsrfToken(user.id);

    return { success: true, accessToken, refreshToken, csrfToken };
  } catch (error) {
    console.error("❌ Error en el inicio de sesión:", error);
    return {
      success: false,
      status: 500,
      message: "Error en el inicio de sesión",
    };
  }
};
