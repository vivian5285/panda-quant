"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCache = exports.cacheMiddleware = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
const redis = new ioredis_1.default(config_1.config.redis.url, {
    password: config_1.config.redis.password
});
redis.on('error', (err) => {
    logger_1.logger.error('Redis connection error:', err);
});
const cacheMiddleware = async (req, res, next) => {
    // 只缓存 GET 请求
    if (req.method !== 'GET') {
        return next();
    }
    const key = req.originalUrl;
    try {
        const cachedData = await redis.get(key);
        if (cachedData) {
            logger_1.logger.debug(`Cache hit for key: ${key}`);
            return res.json(JSON.parse(cachedData));
        }
        // 保存原始的 res.json 方法
        const originalJson = res.json;
        // 重写 res.json 方法以缓存响应
        res.json = function (body) {
            redis.set(key, JSON.stringify(body), 'EX', config_1.config.cache.ttl);
            return originalJson.call(this, body);
        };
        next();
    }
    catch (error) {
        logger_1.logger.error('Cache middleware error:', error);
        next();
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
        logger_1.logger.error('Error clearing cache:', error);
        throw error;
    }
};
exports.clearCache = clearCache;
//# sourceMappingURL=cache.js.map