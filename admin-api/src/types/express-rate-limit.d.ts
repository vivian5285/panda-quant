declare module 'express-rate-limit' {
  import { Request, Response, NextFunction } from 'express';

  interface RateLimitOptions {
    windowMs?: number;
    max?: number | ((req: Request) => number);
    message?: any;
    statusCode?: number;
    headers?: boolean;
    skipFailedRequests?: boolean;
    skipSuccessfulRequests?: boolean;
    keyGenerator?: (req: Request) => string;
    handler?: (req: Request, res: Response, next: NextFunction) => void;
    onLimitReached?: (req: Request, res: Response, options: RateLimitOptions) => void;
    skip?: (req: Request, res: Response) => boolean;
    store?: any;
  }

  function rateLimit(options?: RateLimitOptions): (req: Request, res: Response, next: NextFunction) => void;

  export = rateLimit;
} 