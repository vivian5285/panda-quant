import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/Auth';
import { AppError } from '../utils/AppError';

export const isAdmin = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  if (!req.user || !req.user.isAdmin) {
    throw new AppError('Unauthorized - Admin access required', 403);
  }
  next();
}; 