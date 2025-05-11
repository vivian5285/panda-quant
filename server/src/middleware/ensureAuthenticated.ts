import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/Auth';

export const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authenticatedReq = req as AuthenticatedRequest;
  if (!authenticatedReq.user) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }
  next();
}; 