import { Request, Response, NextFunction } from 'express';
import { ValidationError, ServiceError, DatabaseError, AuthenticationError, AuthorizationError } from '../utils/errors';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    name: err.name
  });

  if (err instanceof ValidationError) {
    res.status(400).json({
      success: false,
      message: err.message,
      type: 'ValidationError'
    });
  } else if (err instanceof AuthenticationError) {
    res.status(401).json({
      success: false,
      message: err.message,
      type: 'AuthenticationError'
    });
  } else if (err instanceof AuthorizationError) {
    res.status(403).json({
      success: false,
      message: err.message,
      type: 'AuthorizationError'
    });
  } else if (err instanceof ServiceError) {
    res.status(500).json({
      success: false,
      message: err.message,
      type: 'ServiceError'
    });
  } else if (err instanceof DatabaseError) {
    res.status(500).json({
      success: false,
      message: 'Database error occurred',
      type: 'DatabaseError'
    });
  } else if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      type: 'TokenError'
    });
  } else if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Token expired',
      type: 'TokenError'
    });
  } else {
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
      type: 'InternalError'
    });
  }
}; 