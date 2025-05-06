import Redis from 'ioredis';
import { config } from '../config';
import { logger } from '../utils/logger';
const redis = new Redis(config.redis.url, {
    password: config.redis.password
});
redis.on('error', (err) => {
    logger.error('Redis connection error:', err);
});
export const cacheMiddleware = async (req, res, next) => {
    // 只缓存 GET 请求
    if (req.method !== 'GET') {
        return next();
    }
    const key = req.originalUrl;
    try {
        const cachedData = await redis.get(key);
        if (cachedData) {
            logger.debug(`Cache hit for key: ${key}`);
            return res.json(JSON.parse(cachedData));
        }
        // 保存原始的 res.json 方法
        const originalJson = res.json;
        // 重写 res.json 方法以缓存响应
        res.json = function (body) {
            redis.set(key, JSON.stringify(body), 'EX', config.cache.ttl);
            return originalJson.call(this, body);
        };
        next();
    }
    catch (error) {
        logger.error('Cache middleware error:', error);
        next();
    }
};
// 清除缓存的方法
export const clearCache = async (pattern) => {
    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
            logger.info(`Cleared ${keys.length} cache entries matching pattern: ${pattern}`);
        }
    }
    catch (error) {
        logger.error('Error clearing cache:', error);
        throw error;
    }
};
//# sourceMappingURL=cache.js.map