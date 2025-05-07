import { Request, Response, NextFunction } from 'express';
export declare class ValidationError extends Error {
    constructor(message: string);
}
export declare const errorHandler: (err: Error, _req: Request, res: Response, _next: NextFunction) => void;
//# sourceMappingURL=error.d.ts.map