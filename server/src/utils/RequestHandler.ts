import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthenticatedRequest } from '../types/Auth';
import { logger } from './Logger';

export type RequestHandlerFunction<T = any> = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<T>;

export const handleRequest = <T = any>(handler: RequestHandlerFunction<T>): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const result = await handler(req as AuthenticatedRequest, res, next);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}; 