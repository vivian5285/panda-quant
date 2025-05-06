"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
const errorHandler = (err, _req, res, _next) => {
    logger_1.logger.error('Error occurred:', {
        error: err.message,
        stack: err.stack,
        name: err.name
    });
    if (err instanceof errors_1.ValidationError) {
        res.status(400).json({
            success: false,
            message: err.message,
            type: 'ValidationError'
        });
    }
    else if (err instanceof errors_1.AuthenticationError) {
        res.status(401).json({
            success: false,
            message: err.message,
            type: 'AuthenticationError'
        });
    }
    else if (err instanceof errors_1.AuthorizationError) {
        res.status(403).json({
            success: false,
            message: err.message,
            type: 'AuthorizationError'
        });
    }
    else if (err instanceof errors_1.ServiceError) {
        res.status(500).json({
            success: false,
            message: err.message,
            type: 'ServiceError'
        });
    }
    else if (err instanceof errors_1.DatabaseError) {
        res.status(500).json({
            success: false,
            message: 'Database error occurred',
            type: 'DatabaseError'
        });
    }
    else if (err.name === 'JsonWebTokenError') {
        res.status(401).json({
            success: false,
            message: 'Invalid token',
            type: 'TokenError'
        });
    }
    else if (err.name === 'TokenExpiredError') {
        res.status(401).json({
            success: false,
            message: 'Token expired',
            type: 'TokenError'
        });
    }
    else {
        res.status(500).json({
            success: false,
            message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
            type: 'InternalError'
        });
    }
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map