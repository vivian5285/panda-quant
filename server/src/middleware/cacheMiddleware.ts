import { MiddlewareHandler } from '../types/express';

export const cacheMiddleware: MiddlewareHandler = (req, res, next) => {
  // Set cache control headers
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
}; 