import { Request, Response, NextFunction } from 'express';
import { ValidationError, ServiceError, DatabaseError, AuthenticationError, AuthorizationError } from '../utils/errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);

  if (err instanceof ValidationError) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err instanceof AuthenticationError) {
    res.status(401).json({
      success: false,
      message: err.message
    });
  } else if (err instanceof AuthorizationError) {
    res.status(403).json({
      success: false,
      message: err.message
    });
  } else if (err instanceof ServiceError || err instanceof DatabaseError) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 