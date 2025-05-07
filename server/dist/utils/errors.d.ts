export declare class AppError extends Error {
    constructor(message: string);
}
export declare class NotFoundError extends Error {
    statusCode: number;
    constructor(message?: string);
}
export declare class BadRequestError extends Error {
    statusCode: number;
    constructor(message?: string);
}
export declare class UnauthorizedError extends Error {
    statusCode: number;
    constructor(message?: string);
}
export declare class ForbiddenError extends Error {
    statusCode: number;
    constructor(message?: string);
}
export declare class ValidationError extends Error {
    statusCode: number;
    errors: Array<{
        field: string;
        message: string;
    }>;
    constructor(errors: Array<{
        field: string;
        message: string;
    }>);
}
export declare class DatabaseError extends Error {
    statusCode: number;
    constructor(message?: string);
}
export declare class ServiceError extends Error {
    statusCode: number;
    constructor(message?: string);
}
//# sourceMappingURL=errors.d.ts.map