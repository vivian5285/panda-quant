import Joi from 'joi';

export const createOrderSchema = Joi.object({
  strategyId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': '无效的策略ID格式',
      'any.required': '策略ID是必需的'
    }),
  amount: Joi.number()
    .required()
    .min(0)
    .messages({
      'number.base': '金额必须是数字',
      'number.min': '金额必须大于0',
      'any.required': '金额是必需的'
    }),
  currency: Joi.string()
    .required()
    .trim()
    .messages({
      'string.empty': '货币不能为空',
      'any.required': '货币是必需的'
    }),
  type: Joi.string()
    .valid('market', 'limit')
    .required()
    .messages({
      'any.only': '无效的订单类型',
      'any.required': '订单类型是必需的'
    }),
  side: Joi.string()
    .valid('buy', 'sell')
    .required()
    .messages({
      'any.only': '无效的交易方向',
      'any.required': '交易方向是必需的'
    }),
  price: Joi.number()
    .when('type', {
      is: 'limit',
      then: Joi.required(),
      otherwise: Joi.forbidden()
    })
    .min(0)
    .messages({
      'number.base': '价格必须是数字',
      'number.min': '价格必须大于0',
      'any.required': '限价单必须指定价格'
    })
});

export const updateOrderSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'executed', 'cancelled', 'failed')
    .messages({
      'any.only': '无效的订单状态'
    }),
  executedPrice: Joi.number()
    .min(0)
    .messages({
      'number.base': '成交价格必须是数字',
      'number.min': '成交价格必须大于0'
    }),
  executedAmount: Joi.number()
    .min(0)
    .messages({
      'number.base': '成交数量必须是数字',
      'number.min': '成交数量必须大于0'
    })
});

export const orderIdSchema = Joi.object({
  id: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': '无效的订单ID格式',
      'any.required': '订单ID是必需的'
    })
}); 