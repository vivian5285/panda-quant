import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Response {
      success: (data: any, message?: string) => void;
      error: (message: string, statusCode?: number) => void;
    }
  }
}

export const responseHandler = (_req: Request, res: Response, next: NextFunction): void => {
  res.success = (data: any, message = 'Success') => {
    res.json({
      success: true,
      message,
      data
    });
  };

  res.error = (message: string, statusCode = 400) => {
    res.status(statusCode).json({
      success: false,
      message
    });
  };

  next();
}; 