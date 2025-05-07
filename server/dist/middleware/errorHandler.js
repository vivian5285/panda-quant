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
    if (err instanceof AppError) {
        logger_1.logger.error(`[${err.statusCode}] ${err.message}`);
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    // Programming or other unknown error
    logger_1.logger.error('Unhandled error:', err);
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
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