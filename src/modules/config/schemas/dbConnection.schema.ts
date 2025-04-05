// src/modules/config/schemas/dbConnection.schema.ts
import Joi from "joi";

export const dbConnectionSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": "El nombre no puede estar vacío.",
      "string.min": "El nombre debe tener al menos 3 caracteres.",
      "string.max": "El nombre no puede exceder los 100 caracteres.",
      "any.required": "El nombre es obligatorio.",
    }),

  descripcion: Joi.string()
    .max(255)
    .allow("")
    .messages({
      "string.max": "La descripción no puede exceder los 255 caracteres.",
    }),

  servidor: Joi.string()
    .hostname()
    .required()
    .messages({
      "string.hostname": "El servidor debe ser un nombre de host válido.",
      "string.empty": "El servidor no puede estar vacío.",
      "any.required": "El servidor es obligatorio.",
    }),

  puerto: Joi.number()
    .integer()
    .min(1)
    .max(65535)
    .default(1433)
    .messages({
      "number.base": "El puerto debe ser un número.",
      "number.min": "El puerto debe ser mayor a 0.",
      "number.max": "El puerto no puede ser mayor a 65535.",
    }),

  usuario: Joi.string()
    .required()
    .messages({
      "string.empty": "El usuario no puede estar vacío.",
      "any.required": "El usuario es obligatorio.",
    }),

  contrasena: Joi.string()
    .required()
    .messages({
      "string.empty": "La contraseña no puede estar vacía.",
      "any.required": "La contraseña es obligatoria.",
    }),

  baseDatos: Joi.string()
    .required()
    .messages({
      "string.empty": "El nombre de la base de datos no puede estar vacío.",
      "any.required": "El nombre de la base de datos es obligatorio.",
    }),

  ssl: Joi.boolean()
    .default(true)
    .messages({
      "boolean.base": "El valor de SSL debe ser verdadero o falso.",
    }),
});
