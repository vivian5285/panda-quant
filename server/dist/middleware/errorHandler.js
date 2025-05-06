"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errors_1 = require("../utils/errors");
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error('Error:', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip
    });
    if (err instanceof errors_1.ValidationError) {
        return res.status(400).json({
            success: false,
            error: {
                name: 'ValidationError',
                message: 'Validation Error',
                details: err.errors
            }
        });
    }
    if (err instanceof errors_1.NotFoundError) {
        return res.status(404).json({
            success: false,
            error: {
                name: 'NotFoundError',
                message: err.message
            }
        });
    }
    if (err instanceof errors_1.BadRequestError) {
        return res.status(400).json({
            success: false,
            error: {
                name: 'BadRequestError',
                message: err.message
            }
        });
    }
    if (err instanceof errors_1.UnauthorizedError) {
        return res.status(401).json({
            success: false,
            error: {
                name: 'UnauthorizedError',
                message: err.message
            }
        });
    }
    if (err instanceof errors_1.ForbiddenError) {
        return res.status(403).json({
            success: false,
            error: {
                name: 'ForbiddenError',
                message: err.message
            }
        });
    }
    // 默认错误响应
    res.status(500).json({
        success: false,
        error: {
            name: 'InternalServerError',
            message: process.env.NODE_ENV === 'production'
                ? 'Internal Server Error'
                : err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map