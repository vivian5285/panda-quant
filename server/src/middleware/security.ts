import type { Request, Response, NextFunction, Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from '../config';
import { HelmetOptions } from 'helmet';
import compression from 'compression';

// 创建速率限制器
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 15分钟内最多100个请求
  message: {
    success: false,
    error: {
      name: 'RateLimitError',
      message: 'Too many requests, please try again later.'
    }
  }
});

// CORS 配置
const corsOptions = {
  origin: config.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24小时
};

// 安全头部配置
const helmetConfig: HelmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: 'same-site' },
  dnsPrefetchControl: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' as const },
  xssFilter: true
};

// 导出中间件
export const securityMiddleware = [
  helmet(),
  cors(),
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  })
];

// 请求大小限制中间件
export const requestSizeLimit = (req: Request, res: Response, next: NextFunction) => {
  const contentLength = parseInt(req.headers['content-length'] || '0');
  if (contentLength > 1024 * 1024) { // 1MB
    return res.status(413).json({
      success: false,
      error: {
        name: 'PayloadTooLargeError',
        message: 'Request entity too large'
      }
    });
  }
  next();
};

export const configureSecurity = (app: Application): void => {
  app.use(helmet(helmetConfig));
};

export const setupSecurity = (app: Application): void => {
  // CORS configuration
  app.use(cors({
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

  // Security headers
  app.use(helmet());

  // Rate limiting
  app.use(rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMax,
    message: 'Too many requests from this IP, please try again later'
  }));

  // Compression
  app.use(compression());
}; 