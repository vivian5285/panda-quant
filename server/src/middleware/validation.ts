import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';
import { Types } from 'mongoose';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).json({
      errors: errors.map((error: ValidationError) => ({
        field: error.param,
        message: error.msg
      }))
    });
  }
  next();
};

export const validateObjectId = (id: string): boolean => {
  return Types.ObjectId.isValid(id);
}; 