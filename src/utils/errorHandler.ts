import { Error } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Error.ValidationError) {
    return res.status(400).json({
      message: 'Validation Error',
      errors: err.errors
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: err.message
    });
  }

  return res.status(500).json({
    message: 'Internal Server Error'
  });
}; 