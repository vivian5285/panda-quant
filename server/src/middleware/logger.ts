import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import { stream } from '../utils/logger';
import { IncomingMessage, ServerResponse } from 'http';

// 自定义日志格式
const logFormat = ':method :url :status :res[content-length] - :response-time ms';

// 创建 Morgan 中间件
export const requestLogger = morgan('combined', {
  stream,
  skip: (req: IncomingMessage) => {
    // 跳过健康检查请求的日志
    return req.url === '/health';
  }
});

// 请求响应时间中间件
export const responseTime = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
    
    if (res.statusCode >= 500) {
      stream.write(`ERROR: ${message}\n`);
    } else if (res.statusCode >= 400) {
      stream.write(`WARN: ${message}\n`);
    } else {
      stream.write(`INFO: ${message}\n`);
    }
  });
  next();
}; 