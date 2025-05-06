"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceError = exports.DatabaseError = exports.ValidationError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.NotFoundError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class NotFoundError extends Error {
    constructor(message = 'Resource not found') {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends Error {
    constructor(message = 'Bad request') {
        super(message);
        this.name = 'BadRequestError';
        this.statusCode = 400;
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends Error {
    constructor(message = 'Unauthorized') {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = 401;
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends Error {
    constructor(message = 'Forbidden') {
        super(message);
        this.name = 'ForbiddenError';
        this.statusCode = 403;
    }
}
exports.ForbiddenError = ForbiddenError;
class ValidationError extends Error {
    constructor(errors) {
        super('Validation Error');
        this.name = 'ValidationError';
        this.statusCode = 400;
        this.errors = errors;
    }
}
exports.ValidationError = ValidationError;
class DatabaseError extends Error {
    constructor(message = 'Database error occurred') {
        super(message);
        this.name = 'DatabaseError';
        this.statusCode = 500;
    }
}
exports.DatabaseError = DatabaseError;
class ServiceError extends Error {
    constructor(message = 'Service error occurred') {
        super(message);
        this.name = 'ServiceError';
        this.statusCode = 500;
    }
}
exports.ServiceError = ServiceError;
//# sourceMappingURL=errors.js.map