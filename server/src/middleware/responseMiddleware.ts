import { Request, Response, NextFunction } from 'express';

export const responseMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Add standard response headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Powered-By', 'Panda Quant');
  next();
}; 