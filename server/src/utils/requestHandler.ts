import { Request, Response, NextFunction, RequestHandler } from 'express';
import type { AuthenticatedRequest } from '../types/express';

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
      await handler(req as unknown as AuthenticatedRequest, res, next);
    } catch (error) {
      next(error);
    }
  };
}; 