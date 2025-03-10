import { Request, Response } from "express";
import UserModel from "../models/user.model";
import RoleModel from "@modules/users/models/role.model";
import UserRoleModel from "@modules/users/models/userRole.model";
import bcrypt from "bcrypt";
import Joi from "joi";
import { Op } from "sequelize";

// Validación con Joi
const userSchema = Joi.object({
  username: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).optional(),
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().min(8).max(20).optional(),
  isActive: Joi.boolean().optional(),
}).min(1); // Al menos un campo debe ser enviado

// Crear Usuario
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  //console.log("LLEGAS", req.body);
  try {
    // Validar datos de entrada con Joi (o Zod si usas otro esquema)
    const { error } = userSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { username, email, password, firstName, lastName, phone } = req.body;

    // Verificar si ya existe usuario o email
    const existingUser = await UserModel.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });

    if (existingUser) {
      res
        .status(409)
        .json({ field: "username", message: "Usuario o correo ya en uso." });
      return;
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en la base de datos
    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      isActive: true, // 🔹 Asegurar que el usuario esté activo
    });

    // Asignar el rol "Invitado" automáticamente
    const invitedRole = await RoleModel.findOne({
      where: { name: "Invitado" },
    });

    if (!invitedRole) {
      res
        .status(400)
        .json({ message: "El rol Invitado no existe en la base de datos." });
      return;
    }

    await UserRoleModel.create({
      userId: newUser.id,
      roleId: invitedRole.id,
    });

    res.status(201).json({
      message: "Usuario registrado correctamente.",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear usuario.", error });
  }
};

// Obtener Usuarios
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserModel.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

// Actualizar Usuario
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = userSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const user = await UserModel.findByPk(id);
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    await user.update(req.body);
    res.status(200).json({ message: "Usuario actualizado exitosamente", user });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error });
  }
};

// Eliminar Usuario
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByPk(id);
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return; // Finaliza la ejecución
    }

    await user.update({ isActive: false }); // Desactivación lógica
    res.status(200).json({ message: "Usuario desactivado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
};
