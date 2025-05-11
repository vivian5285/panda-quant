import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/Logger';
import { handleContractError } from '../utils/ErrorDecoder';

// 基础错误类
export class AppError extends Error {
  statusCode: number;
  code: number;
  data?: any;

  constructor(statusCode: number, message: string, code?: number, data?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code || statusCode;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 验证错误
export class ValidationError extends AppError {
  constructor(message: string, data?: any) {
    super(400, message, 400, data);
  }
}

// 认证错误
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(401, message, 401);
  }
}

// 授权错误
export class AuthorizationError extends AppError {
  constructor(message: string = 'Authorization failed') {
    super(403, message, 403);
  }
}

// 合约错误
export class ContractError extends AppError {
  constructor(code: number, message: string, data?: any) {
    super(400, message, code, data);
  }
}

// 资源未找到错误
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, message, 404);
  }
}

// 请求超时错误
export class TimeoutError extends AppError {
  constructor(message: string = 'Request timeout') {
    super(408, message, 408);
  }
}

// 服务器错误
export class ServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(500, message, 500);
  }
}

// 错误处理中间件
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  logger.error('Error:', err);

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
  if (err instanceof ContractError || (err as any).code === -32000) {
    const decodedError = handleContractError(err as any);
    res.status(400).json({
      success: false,
      error: {
        code: (err as any).code || 400,
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
  const statusCode = (err as any).statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      code: (err as any).code || statusCode,
      message
    }
  });
}; 