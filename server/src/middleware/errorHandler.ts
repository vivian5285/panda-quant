import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.error('App error: ' + err.message, {
      statusCode: err.statusCode,
      stack: err.stack,
      path: req.path,
      method: req.method
    });
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      code: err.code
    });
    return;
  }

  // MongoDB 错误处理
  if (err.name === 'MongoError') {
    logger.error('Database error: ' + err.message, {
      error: err.name,
      stack: err.stack,
      path: req.path,
      method: req.method
    });
    res.status(500).json({
      status: 'error',
      message: 'Database error occurred',
      code: 'DB_ERROR'
    });
    return;
  }

  // 验证错误处理
  if (err.name === 'ValidationError') {
    logger.error('Validation error: ' + err.message, {
      error: err.name,
      stack: err.stack,
      path: req.path,
      method: req.method
    });
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: err.message
    });
    return;
  }

  // 未知错误处理
  logger.error('Internal server error: ' + err.message, {
    error: err.name,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR'
  });
}; 