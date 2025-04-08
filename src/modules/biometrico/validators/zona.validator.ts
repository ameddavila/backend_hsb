import Joi from "joi";

export const zonaSchema = Joi.object({
  nombre: Joi.string().max(100).required().messages({
    "any.required": "El nombre de la zona es obligatorio",
    "string.empty": "El nombre de la zona no puede estar vacío",
  }),
  descripcion: Joi.string().allow("", null),
  configId: Joi.number().required().messages({
    "any.required": "La configuración biométrica es obligatoria",
  }),
});
