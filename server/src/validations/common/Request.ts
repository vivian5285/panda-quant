import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';

export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const validationError = error as ValidationError;
      res.status(400).json({
        message: 'Validation error',
        details: validationError.details.map(detail => detail.message)
      });
      return;
    }
    next();
  };
};

export const validateParams = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const validationError = error as ValidationError;
      res.status(400).json({
        message: 'Validation error',
        details: validationError.details.map(detail => detail.message)
      });
      return;
    }
    next();
  };
};

export const validateQuery = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const validationError = error as ValidationError;
      res.status(400).json({
        message: 'Validation error',
        details: validationError.details.map(detail => detail.message)
      });
      return;
    }
    next();
  };
}; 