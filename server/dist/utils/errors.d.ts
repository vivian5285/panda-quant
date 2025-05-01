export declare class AppError extends Error {
    constructor(message: string);
}
export declare class NotFoundError extends AppError {
    constructor(message: string);
}
export declare class BadRequestError extends AppError {
    constructor(message: string);
}
export declare class UnauthorizedError extends AppError {
    constructor(message: string);
}
export declare class ForbiddenError extends AppError {
    constructor(message: string);
}
