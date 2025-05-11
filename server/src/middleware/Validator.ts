import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ValidationError } from '../utils/AppError';
import { logger } from '../utils/Logger';
import type { Schema } from 'joi';

export const validate = (schema: Schema): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error: any) {
      logger.error('Validation error:', error);
      next(new ValidationError(error.message));
    }
  };
};

export const validateParams = (schema: Schema): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.params, { abortEarly: false });
      next();
    } catch (error: any) {
      logger.error('Params validation error:', error);
      next(new ValidationError(error.message));
    }
  };
};

export const validateQuery = (schema: Schema): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.query, { abortEarly: false });
      next();
    } catch (error: any) {
      logger.error('Query validation error:', error);
      next(new ValidationError(error.message));
    }
  };
};

export const commonValidators = {
  email: (field = 'email') => {
    return {
      field,
      validators: [
        (value: string) => {
          if (!value) {
            throw new Error('Email is required');
          }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            throw new Error('Invalid email format');
          }
          return true;
        }
      ]
    };
  },
  password: (field = 'password') => {
    return {
      field,
      validators: [
        (value: string) => {
          if (!value) {
            throw new Error('Password is required');
          }
          if (value.length < 6) {
            throw new Error('Password must be at least 6 characters long');
          }
          return true;
        }
      ]
    };
  },
  requiredString: (field: string) => {
    return {
      field,
      validators: [
        (value: string) => {
          if (!value) {
            throw new Error(`${field} is required`);
          }
          if (typeof value !== 'string') {
            throw new Error(`${field} must be a string`);
          }
          return true;
        }
      ]
    };
  }
}; 