import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  logger.error('Error:', err);

  if (err instanceof ValidationError) {
    res.status(400).json({
      error: 'Validation Error',
      message: err.message
    });
    return;
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
}; 