import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/Logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  logger.info(`Request: ${req.method} ${req.url} from ${req.ip} with user agent ${req.headers['user-agent']}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`Response: ${req.method} ${req.url} ${res.statusCode} in ${duration}ms`);
  });

  next();
}; 