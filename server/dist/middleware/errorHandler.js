"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRequest = exports.AppError = void 0;
exports.errorHandler = errorHandler;
const errorDecoder_1 = require("../utils/errorDecoder");
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
function errorHandler(error, req, res, next) {
    console.error('Error:', error);
    // 处理智能合约错误
    if (error.code === -32000 && error.data) {
        const decodedError = (0, errorDecoder_1.handleContractError)(error);
        return res.status(400).json({
            success: false,
            error: {
                code: error.code,
                message: decodedError
            }
        });
    }
    // 处理其他类型的错误
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        error: {
            code: error.code || statusCode,
            message
        }
    });
}
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