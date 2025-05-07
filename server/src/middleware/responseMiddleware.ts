import { MiddlewareHandler } from '../types/express';

export const responseMiddleware: MiddlewareHandler = (req, res, next) => {
  // Add standard response headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Powered-By', 'Panda Quant');
  next();
}; 