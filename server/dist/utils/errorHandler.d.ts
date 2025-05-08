import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';
interface CustomError extends Error {
    statusCode?: number;
    errors?: ValidationError[];
}
export declare function handleError(res: Response, error: any): void;
export declare const errorHandlerMiddleware: (err: CustomError, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export {};
//# sourceMappingURL=errorHandler.d.ts.map