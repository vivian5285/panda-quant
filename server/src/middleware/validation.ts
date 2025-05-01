import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Types } from 'mongoose';
import { ValidationError } from './error';

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.body) {
    next(new ValidationError('Request body is required'));
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

export const validateObjectId = (id: string): boolean => {
  return Types.ObjectId.isValid(id);
};

export const validationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

export const commonValidators = {
  requiredString: (field: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.body[field] || typeof req.body[field] !== 'string') {
        res.status(400).json({ error: `${field} is required and must be a string` });
        return;
      }
      next();
    };
  },
  optionalString: (field: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (req.body[field] && typeof req.body[field] !== 'string') {
        res.status(400).json({ error: `${field} must be a string` });
        return;
      }
      next();
    };
  }
}; 