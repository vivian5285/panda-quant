import { Request, Response, NextFunction } from 'express';
export declare const disableCache: (_req: Request, res: Response, next: NextFunction) => void;
export declare const cacheMiddleware: (duration: number) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const clearCache: (pattern: string) => Promise<void>;
//# sourceMappingURL=cache.d.ts.map