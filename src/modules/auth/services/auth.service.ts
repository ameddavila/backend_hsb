import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createHmac } from "crypto";
import UserModel from "@modules/users/models/user.model";
import RoleModel from "@modules/users/models/role.model";
import { Op } from "sequelize";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
const CSRF_SECRET = process.env.CSRF_SECRET || "default_csrf_secret";

export const loginUser = async (
  usernameOrEmail: string,
  password: string
): Promise<{
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
}> => {
  try {
    // Buscar usuario por username o email e incluir los roles
    /*
    console.log(
      "UserModel.sequelize:",
      UserModel.sequelize ? "Inicializado" : "No inicializado"
    );
    */
    const user = await UserModel.findOne({
      where: {
        [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
      include: [
        {
          model: RoleModel,
          as: "roles", // Usando el alias configurado en `relationships.ts`
          through: { attributes: [] }, // No incluir datos de la tabla intermedia
        },
      ],
    });

    // Verificar que el usuario exista
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Contraseña incorrecta");
    }

    // Extraer el primer rol del usuario (si tiene múltiples roles)
    const userRole = user.roles?.[0];
    if (!userRole) {
      throw new Error("El usuario no tiene roles asignados");
    }

    // Generar Access Token
    const accessToken = jwt.sign(
      {
        userId: user.id,
        roleId: userRole.id,
        roleName: userRole.name,
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Generar Refresh Token
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    // Generar CSRF Token basado en el ID del usuario
    const csrfToken = createHmac("sha256", CSRF_SECRET)
      .update(user.id.toString())
      .digest("hex");

    return { accessToken, refreshToken, csrfToken };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Error en el inicio de sesión");
    }
    throw new Error("Error desconocido en el inicio de sesión");
  }
};

export const refreshToken = async (token: string): Promise<string> => {
  const payload = jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: string };
  const accessToken = jwt.sign(
    { userId: payload.userId },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  return accessToken;
};
