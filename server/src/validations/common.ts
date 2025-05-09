import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { logger } from '../utils/logger';

export const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      logger.warn('Validation error:', error.details);
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

export const validateParams = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params);
    if (error) {
      logger.warn('Validation error:', error.details);
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

export const validateQuery = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.query);
    if (error) {
      logger.warn('Validation error:', error.details);
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
}; 