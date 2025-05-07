export declare class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    constructor(message: string, statusCode: number);
}
export declare class ValidationError extends AppError {
    constructor(message: string);
}
export declare class AuthenticationError extends AppError {
    constructor(message?: string);
}
export declare class AuthorizationError extends AppError {
    constructor(message?: string);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string);
}
export declare class ConflictError extends AppError {
    constructor(message?: string);
}
export declare class DatabaseError extends AppError {
    constructor(message?: string);
}
export declare class ServiceError extends AppError {
    constructor(message?: string);
}
//# sourceMappingURL=AppError.d.ts.map