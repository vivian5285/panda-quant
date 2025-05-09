import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { config } from '../config';
import { logger } from '../utils/logger';

class ServerError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'ServerError';
  }
}

// Redis 连接配置
const redisConfig = {
  url: config.redis.url,
  password: config.redis.password
};

// 创建 Redis 客户端
const redis = new Redis(redisConfig);

// Redis 连接事件处理
redis.on('connect', () => {
  logger.info('Redis connected successfully');
});

redis.on('error', (error: Error) => {
  logger.error('Redis connection error:', error);
  throw new ServerError('Redis connection failed', 500);
});

// 禁用缓存的中间件
export const disableCache = (_req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};

// Redis 缓存中间件
export const cacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // 只缓存 GET 请求
  if (req.method !== 'GET') {
    return next();
  }

  const key = `cache:${req.originalUrl}`;

  try {
    const cachedData = await redis.get(key);
    if (cachedData) {
      logger.debug(`Cache hit for key: ${key}`);
      return res.json(JSON.parse(cachedData));
    }

    res.sendResponse = res.json;
    res.json = (body: unknown) => {
      redis.set(key, JSON.stringify(body), 'EX', config.cache.ttl);
      res.sendResponse(body);
    };

    next();
  } catch (error: unknown) {
    logger.error('Cache middleware error:', error);
    if (error instanceof Error) {
      throw new ServerError(`Cache error: ${error.message}`, 500);
    }
    throw new ServerError('Unknown cache error', 500);
  }
};

// 清除缓存的方法
export const clearCache = async (pattern: string): Promise<void> => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      logger.info(`Cleared ${keys.length} cache entries matching pattern: ${pattern}`);
    }
  } catch (error: unknown) {
    logger.error('Clear cache error:', error);
    if (error instanceof Error) {
      throw new ServerError(`Failed to clear cache: ${error.message}`, 500);
    }
    throw new ServerError('Unknown cache error', 500);
  }
}; 