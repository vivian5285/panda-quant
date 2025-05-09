import Joi from 'joi';

export const emailSchema = Joi.string()
  .email()
  .required()
  .messages({
    'string.email': '无效的邮箱格式',
    'string.empty': '邮箱不能为空',
    'any.required': '邮箱是必需的'
  });

export const passwordSchema = Joi.string()
  .min(6)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .required()
  .messages({
    'string.min': '密码至少需要6个字符',
    'string.pattern.base': '密码必须包含大小写字母和数字',
    'string.empty': '密码不能为空',
    'any.required': '密码是必需的'
  });

export const loginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema
});

export const registerSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': '两次输入的密码不一致',
      'any.required': '请确认密码'
    }),
  username: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.min': '用户名至少需要3个字符',
      'string.max': '用户名不能超过30个字符',
      'string.empty': '用户名不能为空',
      'any.required': '用户名是必需的'
    })
}); 