import { Request, Response, NextFunction } from 'express';

export class ValidationError extends Error {
  constructor(public details: any) {
    super('Validation Error');
    this.name = 'ValidationError';
  }
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: err.details
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
}; 