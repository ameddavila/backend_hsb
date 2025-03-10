import Joi from "joi";

export const validateUser = (data: any) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    phone: Joi.string().min(8).max(20).optional(),
  });

  return schema.validate(data, { abortEarly: false });
};
