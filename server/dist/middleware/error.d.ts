import { Request, Response, NextFunction } from 'express';
export declare class AppError extends Error {
    statusCode: number;
    code: number;
    data?: any;
    constructor(statusCode: number, message: string, code?: number, data?: any);
}
export declare class ValidationError extends AppError {
    constructor(message: string, data?: any);
}
export declare class AuthenticationError extends AppError {
    constructor(message?: string);
}
export declare class AuthorizationError extends AppError {
    constructor(message?: string);
}
export declare class ContractError extends AppError {
    constructor(code: number, message: string, data?: any);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string);
}
export declare class TimeoutError extends AppError {
    constructor(message?: string);
}
export declare class ServerError extends AppError {
    constructor(message?: string);
}
export declare const errorHandler: (err: Error, _req: Request, res: Response, _next: NextFunction) => void;
//# sourceMappingURL=error.d.ts.map