import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: err.message
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Unauthorized',
      error: err.message
    });
  }

  if (err.name === 'ForbiddenError') {
    return res.status(403).json({
      message: 'Forbidden',
      error: err.message
    });
  }

  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      message: 'Not Found',
      error: err.message
    });
  }

  // Default error
  return res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
}; 