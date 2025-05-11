import Joi from 'joi';

export const createUserSchema = Joi.object({
  // TODO: 补充字段
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

export const updateUserSchema = Joi.object({
  // TODO: 补充字段
  username: Joi.string().optional(),
  password: Joi.string().optional(),
  email: Joi.string().email().optional(),
});

export const userIdSchema = Joi.object({
  id: Joi.string().required(),
}); 