"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, _next) => {
    if (err instanceof AppError_1.AppError) {
        logger_1.logger.error('App error: ' + err.message, {
            statusCode: err.statusCode,
            stack: err.stack,
            path: req.path,
            method: req.method
        });
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            code: err.code
        });
        return;
    }
    // MongoDB 错误处理
    if (err.name === 'MongoError') {
        logger_1.logger.error('Database error: ' + err.message, {
            error: err.name,
            stack: err.stack,
            path: req.path,
            method: req.method
        });
        res.status(500).json({
            status: 'error',
            message: 'Database error occurred',
            code: 'DB_ERROR'
        });
        return;
    }
    // 验证错误处理
    if (err.name === 'ValidationError') {
        logger_1.logger.error('Validation error: ' + err.message, {
            error: err.name,
            stack: err.stack,
            path: req.path,
            method: req.method
        });
        res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: err.message
        });
        return;
    }
    // 未知错误处理
    logger_1.logger.error('Internal server error: ' + err.message, {
        error: err.name,
        stack: err.stack,
        path: req.path,
        method: req.method
    });
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR'
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map