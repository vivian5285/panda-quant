import Joi from 'joi';
import { StrategyType, StrategyStatus } from '../types/Enums';

export const createStrategySchema = Joi.object({
  name: Joi.string().required().min(3).max(50)
    .messages({
      'string.empty': '策略名称不能为空',
      'string.min': '策略名称至少需要3个字符',
      'string.max': '策略名称不能超过50个字符',
      'any.required': '策略名称是必需的'
    }),
  description: Joi.string().required().min(10).max(500)
    .messages({
      'string.empty': '策略描述不能为空',
      'string.min': '策略描述至少需要10个字符',
      'string.max': '策略描述不能超过500个字符',
      'any.required': '策略描述是必需的'
    }),
  type: Joi.string().valid(...Object.values(StrategyType)).required()
    .messages({
      'any.only': '无效的策略类型',
      'any.required': '策略类型是必需的'
    }),
  parameters: Joi.object().required()
    .messages({
      'object.base': '参数必须是对象类型',
      'any.required': '参数是必需的'
    })
});

export const updateStrategySchema = Joi.object({
  name: Joi.string().min(3).max(50)
    .messages({
      'string.min': '策略名称至少需要3个字符',
      'string.max': '策略名称不能超过50个字符'
    }),
  description: Joi.string().min(10).max(500)
    .messages({
      'string.min': '策略描述至少需要10个字符',
      'string.max': '策略描述不能超过500个字符'
    }),
  type: Joi.string().valid(...Object.values(StrategyType))
    .messages({
      'any.only': '无效的策略类型'
    }),
  status: Joi.string().valid(...Object.values(StrategyStatus))
    .messages({
      'any.only': '无效的策略状态'
    }),
  parameters: Joi.object()
    .messages({
      'object.base': '参数必须是对象类型'
    })
});

export const strategyIdSchema = Joi.object({
  id: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': '无效的策略ID格式',
      'any.required': '策略ID是必需的'
    })
}); 