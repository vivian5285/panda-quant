import { Request, Response, NextFunction, RequestHandler } from 'express';
import type { AuthenticatedRequest } from '../types/express';
import { isAuthenticatedRequest } from './typeGuards';

type RequestHandlerFunction = (
  req: AuthenticatedRequest,
  res: Response,
  next?: NextFunction
) => Promise<void>;

export const handleRequest = (
  handler: RequestHandlerFunction
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isAuthenticatedRequest(req)) {
        throw new Error('Invalid request type');
      }
      await handler(req as AuthenticatedRequest, res, next);
    } catch (error) {
      next(error);
    }
  };
}; 