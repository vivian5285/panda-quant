import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Response {
      success: (data: any) => void;
      error: (error: Error | string) => void;
    }
  }
}

export const responseHandler = (req: Request, res: Response, next: NextFunction) => {
  res.success = (data: any) => {
    res.json({
      success: true,
      data
    });
  };

  res.error = (error: Error | string) => {
    const errorMessage = error instanceof Error ? error.message : error;
    res.status(500).json({
      success: false,
      error: errorMessage
    });
  };

  next();
}; 