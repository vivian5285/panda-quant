import { Request, Response, NextFunction } from 'express';
export declare class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    constructor(message: string, statusCode: number);
}
export declare const errorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => void;
export declare const handleRequest: (fn: Function) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=errorHandler.d.ts.map