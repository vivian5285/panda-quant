"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.StrategyError = void 0;
const logger_1 = require("./logger");
class StrategyError extends Error {
    constructor(message, code, context) {
        super(message);
        this.code = code;
        this.context = context;
        this.name = 'StrategyError';
    }
}
exports.StrategyError = StrategyError;
const handleError = (error, context) => {
    if (error instanceof StrategyError) {
        (0, logger_1.logError)(error, context);
        throw error;
    }
    if (error instanceof Error) {
        (0, logger_1.logError)(error, context);
        throw new StrategyError(error.message, 'UNKNOWN_ERROR', { originalError: error });
    }
    const unknownError = new Error('An unknown error occurred');
    (0, logger_1.logError)(unknownError, context);
    throw new StrategyError('An unknown error occurred', 'UNKNOWN_ERROR', { originalError: error });
};
exports.handleError = handleError;
