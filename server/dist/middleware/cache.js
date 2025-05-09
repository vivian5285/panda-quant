"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCache = exports.cacheMiddleware = exports.disableCache = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
class ServerError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ServerError';
    }
}
// Redis 连接配置
const redisConfig = {
    url: config_1.config.redis.url,
    password: config_1.config.redis.password
};
// 创建 Redis 客户端
const redis = new ioredis_1.default(redisConfig);
// Redis 连接事件处理
redis.on('connect', () => {
    logger_1.logger.info('Redis connected successfully');
});
redis.on('error', (error) => {
    logger_1.logger.error('Redis connection error:', error);
    throw new ServerError('Redis connection failed', 500);
});
// 禁用缓存的中间件
const disableCache = (_req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
};
exports.disableCache = disableCache;
// Redis 缓存中间件
const cacheMiddleware = async (req, res, next) => {
    // 只缓存 GET 请求
    if (req.method !== 'GET') {
        return next();
    }
    const key = `cache:${req.originalUrl}`;
    try {
        const cachedData = await redis.get(key);
        if (cachedData) {
            logger_1.logger.debug(`Cache hit for key: ${key}`);
            return res.json(JSON.parse(cachedData));
        }
        res.sendResponse = res.json;
        res.json = (body) => {
            redis.set(key, JSON.stringify(body), 'EX', config_1.config.cache.ttl);
            res.sendResponse(body);
        };
        next();
    }
    catch (error) {
        logger_1.logger.error('Cache middleware error:', error);
        if (error instanceof Error) {
            throw new ServerError(`Cache error: ${error.message}`, 500);
        }
        throw new ServerError('Unknown cache error', 500);
    }
};
exports.cacheMiddleware = cacheMiddleware;
// 清除缓存的方法
const clearCache = async (pattern) => {
    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
            logger_1.logger.info(`Cleared ${keys.length} cache entries matching pattern: ${pattern}`);
        }
    }
    catch (error) {
        logger_1.logger.error('Clear cache error:', error);
        if (error instanceof Error) {
            throw new ServerError(`Failed to clear cache: ${error.message}`, 500);
        }
        throw new ServerError('Unknown cache error', 500);
    }
};
exports.clearCache = clearCache;
//# sourceMappingURL=cache.js.map