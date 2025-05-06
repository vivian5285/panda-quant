"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.ValidationError = void 0;
const logger_1 = require("../utils/logger");
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
const errorHandler = (err, _req, res, _next) => {
    logger_1.logger.error('Error:', err);
    if (err instanceof ValidationError) {
        res.status(400).json({
            error: 'Validation Error',
            message: err.message
        });
        return;
    }
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.js.map