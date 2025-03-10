import { Request, Response } from "express";
import UserModel from "../models/user.model";
import RoleModel from "@modules/users/models/role.model";
import UserRoleModel from "@modules/users/models/userRole.model";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { validateUser } from "@utils/validation";

// 🚀 **Crear usuario**
export const createUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details.map((err) => err.message).join(", "),
      });
    }

    const { username, email, password, firstName, lastName, phone } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await UserModel.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      isActive: true,
    });

    // Asignar rol "Invitado" automáticamente
    const invitedRole = await RoleModel.findOne({
      where: { name: "Invitado" },
    });

    if (!invitedRole) {
      return res.status(400).json({ message: "El rol Invitado no existe." });
    }

    await UserRoleModel.create({
      userId: newUser.id,
      roleId: invitedRole.id,
    });

    return res.status(201).json({
      message: "Usuario registrado correctamente.",
      user: newUser,
    });
  } catch (error) {
    console.error("❌ Error en createUser:", error);
    return res.status(500).json({ message: "Error interno al crear usuario." });
  }
};

// 🚀 **Obtener todos los usuarios**
export const getUsers = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const users = await UserModel.findAll({
      attributes: { exclude: ["password"] }, // No devolver la contraseña
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error en getUsers:", error);
    return res
      .status(500)
      .json({ message: "Error interno al obtener usuarios." });
  }
};

// 🚀 **Actualizar usuario**
export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { error } = validateUser(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details.map((err) => err.message).join(", "),
      });
    }

    const user = await UserModel.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    await user.update(req.body);
    return res
      .status(200)
      .json({ message: "Usuario actualizado correctamente." });
  } catch (error) {
    console.error("❌ Error en updateUser:", error);
    return res
      .status(500)
      .json({ message: "Error interno al actualizar usuario." });
  }
};

// 🚀 **Eliminar usuario (Desactivación lógica)**
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    await user.update({ isActive: false }); // Desactivar usuario en lugar de eliminarlo
    return res
      .status(200)
      .json({ message: "Usuario desactivado correctamente." });
  } catch (error) {
    console.error("❌ Error en deleteUser:", error);
    return res
      .status(500)
      .json({ message: "Error interno al eliminar usuario." });
  }
};
