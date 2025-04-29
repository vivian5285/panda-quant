import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = ValidationError.array();
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: errors.map(error => ({
        field: error.param,
        message: error.msg
      }))
    });
  }
  next();
}; 