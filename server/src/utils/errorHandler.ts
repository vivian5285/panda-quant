import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';
import { Error as MongooseError } from 'mongoose';
import { NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError } from './errors';
import { logger } from './logger';

interface CustomError extends Error {
  statusCode?: number;
  errors?: ValidationError[];
  status?: number;
}

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
  } else if (error instanceof MongooseError.ValidationError) {
    const errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message
    }));
    res.status(400).json({
      success: false,
      errors: errors
    });
  } else if (error instanceof MongooseError.CastError) {
    res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  } else {
    res.status(500).json({ error: '服务器内部错误' });
  }
}

export const errorHandlerMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(err);
  }
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
  return;
}; 