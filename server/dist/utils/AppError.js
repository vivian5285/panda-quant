export class AppError extends Error {
    constructor(message, statusCode = 500, code = 'INTERNAL_SERVER_ERROR', isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        // 确保错误名称正确
        this.name = this.constructor.name;
        // 捕获堆栈跟踪
        Error.captureStackTrace(this, this.constructor);
    }
}
// 常用的错误类型
export class BadRequestError extends AppError {
    constructor(message) {
        super(message, 400, 'BAD_REQUEST');
    }
}
export class UnauthorizedError extends AppError {
    constructor(message) {
        super(message, 401, 'UNAUTHORIZED');
    }
}
export class ForbiddenError extends AppError {
    constructor(message) {
        super(message, 403, 'FORBIDDEN');
    }
}
export class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404, 'NOT_FOUND');
    }
}
export class ConflictError extends AppError {
    constructor(message) {
        super(message, 409, 'CONFLICT');
    }
}
export class ValidationError extends AppError {
    constructor(message) {
        super(message, 422, 'VALIDATION_ERROR');
    }
}
export class RateLimitError extends AppError {
    constructor(message) {
        super(message, 429, 'RATE_LIMIT_EXCEEDED');
    }
}
//# sourceMappingURL=AppError.js.map