import { Request, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const validateRequest = (schema: any) => {
  return async (req: Request, _res: any, next: NextFunction): Promise<void> => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new AppError('Invalid request data', 400));
      }
    }
  };
}; 