import { Request, Response, NextFunction } from 'express';
export declare class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    constructor(message: string, statusCode: number);
}
export declare function errorHandler(error: any, req: Request, res: Response, next: NextFunction): any;
export declare const handleRequest: (fn: Function) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=errorHandler.d.ts.map