"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerMiddleware = void 0;
exports.handleError = handleError;
const mongoose_1 = require("mongoose");
const errors_1 = require("./errors");
const logger_1 = require("./logger");
function handleError(res, error) {
    logger_1.logger.error(error);
    if (error instanceof errors_1.NotFoundError) {
        res.status(404).json({ error: error.message });
    }
    else if (error instanceof errors_1.BadRequestError) {
        res.status(400).json({ error: error.message });
    }
    else if (error instanceof errors_1.UnauthorizedError) {
        res.status(401).json({ error: error.message });
    }
    else if (error instanceof errors_1.ForbiddenError) {
        res.status(403).json({ error: error.message });
    }
    else if (error instanceof mongoose_1.Error.ValidationError) {
        const errors = Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
        }));
        res.status(400).json({
            success: false,
            errors: errors
        });
    }
    else if (error instanceof mongoose_1.Error.CastError) {
        res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }
    else {
        res.status(500).json({ error: '服务器内部错误' });
    }
}
const errorHandlerMiddleware = (err, _req, res, _next) => {
    logger_1.logger.error('Error:', err);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
        stack: process.env['NODE_ENV'] === 'development' ? err.stack : undefined
    });
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
//# sourceMappingURL=errorHandler.js.map