import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { logger } from '../utils/logger';

export const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      logger.warn('Validation error:', error.details);
      res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
      return;
    }
    next();
  };
};

export const validateParams = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.params);
    if (error) {
      logger.warn('Validation error:', error.details);
      res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
      return;
    }
    next();
  };
};

export const validateQuery = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query);
    if (error) {
      logger.warn('Validation error:', error.details);
      res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
      return;
    }
    next();
  };
}; 