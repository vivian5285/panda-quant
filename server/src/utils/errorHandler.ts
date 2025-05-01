import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { Error } from 'mongoose';
import { NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError } from './errors';
import { logger } from './logger';

export function handleError(res: Response, error: any): void {
  logger.error(error);

  if (error instanceof NotFoundError) {
    res.status(404).json({ error: error.message });
  } else if (error instanceof BadRequestError) {
    res.status(400).json({ error: error.message });
  } else if (error instanceof UnauthorizedError) {
    res.status(401).json({ error: error.message });
  } else if (error instanceof ForbiddenError) {
    res.status(403).json({ error: error.message });
  } else if (error instanceof Error.ValidationError) {
    const errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message
    }));
    res.status(400).json({
      success: false,
      errors: errors
    });
  } else if (error instanceof Error.CastError) {
    res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  } else {
    res.status(500).json({ error: '服务器内部错误' });
  }
}

export const errorHandlerMiddleware: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error:', err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    stack: process.env['NODE_ENV'] === 'development' ? err.stack : undefined
  });
}; 