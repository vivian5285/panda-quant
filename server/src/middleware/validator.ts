import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from '../utils/errors';

interface ValidationErrorItem {
  field: string;
  message: string;
}

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors: ValidationErrorItem[] = errors.array().map(err => ({
      field: err.type === 'field' ? err.path : err.type,
      message: err.msg
    }));

    throw new ValidationError(extractedErrors);
  };
};

export const validateQuery = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors: ValidationErrorItem[] = errors.array().map(err => ({
      field: err.type === 'field' ? err.path : err.type,
      message: err.msg
    }));

    throw new ValidationError(extractedErrors);
  };
};

export const validateParams = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors: ValidationErrorItem[] = errors.array().map(err => ({
      field: err.type === 'field' ? err.path : err.type,
      message: err.msg
    }));

    throw new ValidationError(extractedErrors);
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