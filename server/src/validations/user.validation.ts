import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';

export const validateUserRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
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