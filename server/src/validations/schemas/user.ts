import Joi from 'joi';
import { emailSchema, passwordSchema } from '../common/auth';

export const createUserSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
  username: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.min': '用户名至少需要3个字符',
      'string.max': '用户名不能超过30个字符',
      'string.empty': '用户名不能为空',
      'any.required': '用户名是必需的'
    }),
  role: Joi.string()
    .valid('user', 'admin')
    .default('user')
    .messages({
      'any.only': '无效的用户角色'
    })
});

export const updateUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .messages({
      'string.email': '无效的邮箱格式'
    }),
  username: Joi.string()
    .min(3)
    .max(30)
    .messages({
      'string.min': '用户名至少需要3个字符',
      'string.max': '用户名不能超过30个字符'
    }),
  role: Joi.string()
    .valid('user', 'admin')
    .messages({
      'any.only': '无效的用户角色'
    }),
  status: Joi.string()
    .valid('active', 'inactive', 'suspended')
    .messages({
      'any.only': '无效的用户状态'
    })
});

export const userIdSchema = Joi.object({
  id: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': '无效的用户ID格式',
      'any.required': '用户ID是必需的'
    })
}); 