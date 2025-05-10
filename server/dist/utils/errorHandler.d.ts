import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';
interface CustomError extends Error {
    statusCode?: number;
    errors?: ValidationError[];
    status?: number;
}
export declare function handleError(res: Response, error: any): void;
export declare const errorHandlerMiddleware: (err: CustomError, req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=errorHandler.d.ts.map