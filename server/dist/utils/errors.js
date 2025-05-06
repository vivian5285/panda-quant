export class AppError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class NotFoundError extends Error {
    constructor(message = 'Resource not found') {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}
export class BadRequestError extends Error {
    constructor(message = 'Bad request') {
        super(message);
        this.name = 'BadRequestError';
        this.statusCode = 400;
    }
}
export class UnauthorizedError extends Error {
    constructor(message = 'Unauthorized') {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = 401;
    }
}
export class ForbiddenError extends Error {
    constructor(message = 'Forbidden') {
        super(message);
        this.name = 'ForbiddenError';
        this.statusCode = 403;
    }
}
export class ValidationError extends Error {
    constructor(errors) {
        super('Validation Error');
        this.name = 'ValidationError';
        this.statusCode = 400;
        this.errors = errors;
    }
}
export class DatabaseError extends Error {
    constructor(message = 'Database error occurred') {
        super(message);
        this.name = 'DatabaseError';
        this.statusCode = 500;
    }
}
export class ServiceError extends Error {
    constructor(message = 'Service error occurred') {
        super(message);
        this.name = 'ServiceError';
        this.statusCode = 500;
    }
}
//# sourceMappingURL=errors.js.map