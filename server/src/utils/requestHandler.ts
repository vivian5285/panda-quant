import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/Auth';

export const handleRequest = (
  handler: (req: AuthenticatedRequest, res: Response) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req as AuthenticatedRequest, res);
    } catch (error) {
      next(error);
    }
  };
}; 