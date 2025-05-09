"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.ServerError = exports.TimeoutError = exports.NotFoundError = exports.ContractError = exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = exports.AppError = void 0;
const logger_1 = require("../utils/logger");
const errorDecoder_1 = require("../utils/errorDecoder");
// 基础错误类
class AppError extends Error {
    constructor(statusCode, message, code, data) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code || statusCode;
        this.data = data;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// 验证错误
class ValidationError extends AppError {
    constructor(message, data) {
        super(400, message, 400, data);
    }
}
exports.ValidationError = ValidationError;
// 认证错误
class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(401, message, 401);
    }
}
exports.AuthenticationError = AuthenticationError;
// 授权错误
class AuthorizationError extends AppError {
    constructor(message = 'Authorization failed') {
        super(403, message, 403);
    }
}
exports.AuthorizationError = AuthorizationError;
// 合约错误
class ContractError extends AppError {
    constructor(code, message, data) {
        super(400, message, code, data);
    }
}
exports.ContractError = ContractError;
// 资源未找到错误
class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(404, message, 404);
    }
}
exports.NotFoundError = NotFoundError;
// 请求超时错误
class TimeoutError extends AppError {
    constructor(message = 'Request timeout') {
        super(408, message, 408);
    }
}
exports.TimeoutError = TimeoutError;
// 服务器错误
class ServerError extends AppError {
    constructor(message = 'Internal server error') {
        super(500, message, 500);
    }
}
exports.ServerError = ServerError;
// 错误处理中间件
const errorHandler = (err, _req, res, _next) => {
    logger_1.logger.error('Error:', err);
    // 处理 AppError 类型的错误
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
                ...(err.data && { data: err.data })
            }
        });
        return;
    }
    // 处理智能合约错误
    if (err instanceof ContractError || err.code === -32000) {
        const decodedError = (0, errorDecoder_1.handleContractError)(err);
        res.status(400).json({
            success: false,
            error: {
                code: err.code || 400,
                message: decodedError
            }
        });
        return;
    }
    // 处理 JWT 错误
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        res.status(401).json({
            success: false,
            error: {
                code: 401,
                message: 'Invalid or expired token'
            }
        });
        return;
    }
    // 处理验证错误
    if (err.name === 'ValidationError') {
        res.status(400).json({
            success: false,
            error: {
                code: 400,
                message: err.message
            }
        });
        return;
    }
    // 处理其他类型的错误
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        error: {
            code: err.code || statusCode,
            message
        }
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.js.map