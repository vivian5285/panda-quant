"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionError = exports.NotFoundError = exports.ServiceError = exports.DatabaseError = exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = void 0;
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
class AuthenticationError extends Error {
    constructor(message, originalError) {
        super(message);
        this.originalError = originalError;
        this.name = 'AuthenticationError';
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends Error {
    constructor(message, originalError) {
        super(message);
        this.originalError = originalError;
        this.name = 'AuthorizationError';
    }
}
exports.AuthorizationError = AuthorizationError;
class DatabaseError extends Error {
    constructor(message, originalError) {
        super(message);
        this.originalError = originalError;
        this.name = 'DatabaseError';
    }
}
exports.DatabaseError = DatabaseError;
class ServiceError extends Error {
    constructor(message, originalError) {
        super(message);
        this.originalError = originalError;
        this.name = 'ServiceError';
    }
}
exports.ServiceError = ServiceError;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class PermissionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PermissionError';
    }
}
exports.PermissionError = PermissionError;
//# sourceMappingURL=errors.js.map