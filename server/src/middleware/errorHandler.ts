import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { handleContractError } from '../utils/errorDecoder';

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error:', err);

  if (err.name === 'ValidationError') {
    res.status(400).json({
      error: 'Validation Error',
      details: err.message
    });
    return;
  }

  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      error: 'Unauthorized',
      details: err.message
    });
    return;
  }

  if (err.name === 'ForbiddenError') {
    res.status(403).json({
      error: 'Forbidden',
      details: err.message
    });
    return;
  }

  if (err.name === 'NotFoundError') {
    res.status(404).json({
      error: 'Not Found',
      details: err.message
    });
    return;
  }

  res.status(500).json({
    error: 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
};

export const handleRequest = (fn: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}; 