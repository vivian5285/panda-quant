"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRequest = exports.errorHandler = exports.AppError = void 0;
const logger_1 = require("../utils/logger");
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error('Error:', err);
    if (err.name === 'ValidationError') {
        res.status(400).json({
            error: 'Validation Error',
            details: err.message
        });
        return;
    }
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            error: 'Unauthorized',
            details: err.message
        });
        return;
    }
    if (err.name === 'ForbiddenError') {
        res.status(403).json({
            error: 'Forbidden',
            details: err.message
        });
        return;
    }
    if (err.name === 'NotFoundError') {
        res.status(404).json({
            error: 'Not Found',
            details: err.message
        });
        return;
    }
    res.status(500).json({
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
    });
};
exports.errorHandler = errorHandler;
const handleRequest = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (error) {
            next(error);
        }
    };
};
exports.handleRequest = handleRequest;
//# sourceMappingURL=errorHandler.js.map