import Joi from "joi";

export const dbConnectionSchema = Joi.object({
  nombre: Joi.string().min(3).max(100).required().messages({
    "string.base": "El nombre debe ser un texto.",
    "string.empty": "El nombre no puede estar vacío.",
    "string.min": "El nombre debe tener al menos 3 caracteres.",
    "string.max": "El nombre no puede exceder los 100 caracteres.",
    "any.required": "El nombre es obligatorio."
  }),
  servidor: Joi.string().required().messages({
    "any.required": "El servidor es obligatorio.",
    "string.empty": "El servidor no puede estar vacío."
  }),
  usuario: Joi.string().required().messages({
    "any.required": "El usuario es obligatorio.",
    "string.empty": "El usuario no puede estar vacío."
  }),
  contrasena: Joi.string().required().messages({
    "any.required": "La contraseña es obligatoria.",
    "string.empty": "La contraseña no puede estar vacía."
  }),
  baseDatos: Joi.string().required().messages({
    "any.required": "El nombre de la base de datos es obligatorio.",
    "string.empty": "La base de datos no puede estar vacía."
  }),
  puerto: Joi.number().default(1433).messages({
    "number.base": "El puerto debe ser un número."
  }),
  zona: Joi.string().optional().allow("").messages({
    "string.base": "La zona debe ser texto."
  })
});
