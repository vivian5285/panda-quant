import { Request, Response, NextFunction } from 'express';
export declare const cacheMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>, number>>;
export declare const clearCache: (pattern: string) => Promise<void>;
//# sourceMappingURL=cache.d.ts.map