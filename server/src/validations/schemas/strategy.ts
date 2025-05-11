import Joi from 'joi';

export const createStrategySchema = Joi.object({
  // TODO: 补充字段
  name: Joi.string().required(),
  description: Joi.string().optional(),
});

export const updateStrategySchema = Joi.object({
  // TODO: 补充字段
  name: Joi.string().optional(),
  description: Joi.string().optional(),
});

export const strategyIdSchema = Joi.object({
  id: Joi.string().required(),
}); 