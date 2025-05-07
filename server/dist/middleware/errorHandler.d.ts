import { Request, Response, NextFunction } from 'express';
export declare class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    constructor(message: string, statusCode: number);
}
export declare const errorHandler: (err: Error | AppError, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>, number>;
export declare const handleRequest: (fn: Function) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=errorHandler.d.ts.map