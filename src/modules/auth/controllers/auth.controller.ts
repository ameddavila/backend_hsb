import { Request, Response, NextFunction } from "express";
import UserModel from "../../users/models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";
import { Op } from "sequelize"; // Asegúrate de importar Op

// Validación para login con Joi
const loginSchema = Joi.object({
  usernameOrEmail: Joi.string().required(), // Puede ser username o email
  password: Joi.string().min(8).required(),
});

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("🔍 [login] Iniciando proceso de autenticación...");

    // Validar datos de entrada
    const { error } = loginSchema.validate(req.body);
    if (error) {
      console.log(
        `⚠️ [login] Error en validación de datos: ${error.details[0].message}`
      );
      res.status(400).json({ message: error.details[0].message });
      return; // Salir de la función, no es necesario el return explícito para continuar
    }

    const { usernameOrEmail, password } = req.body;

    // Buscar usuario por username o email
    const user = await UserModel.findOne({
      where: {
        [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    if (!user || !user.isActive) {
      console.log(
        `⚠️ [login] Usuario no encontrado o inactivo: ${usernameOrEmail}`
      );
      res.status(401).json({ message: "Usuario o contraseña incorrectos" });
      return; // Salir de la función
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(
        `⚠️ [login] Contraseña incorrecta para el usuario: ${usernameOrEmail}`
      );
      res.status(401).json({ message: "Usuario o contraseña incorrectos" });
      return; // Salir de la función
    }

    console.log(
      `✅ [login] Autenticación exitosa para el usuario: ${usernameOrEmail}`
    );

    // Generar tokens JWT
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_ACCESS_EXPIRATION || "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: process.env.JWT_REFRESH_EXPIRATION || "7d" }
    );

    // Enviar la respuesta
    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error("❌ [login] Error en el login:", error);
    next(error); // Llamar al middleware de manejo de errores
  }
};
