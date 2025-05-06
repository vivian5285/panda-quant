import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/Auth';

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user || !authReq.user.isAdmin) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  next();
}; 