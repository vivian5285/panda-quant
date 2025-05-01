"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const redis_1 = require("redis");
const logger_1 = require("../utils/logger");
class RedisService {
    constructor() {
        this.client = (0, redis_1.createClient)({
            url: process.env['REDIS_URL'] || 'redis://localhost:6379'
        });
        this.client.on('error', (err) => {
            logger_1.logger.error('Redis Client Error:', err);
        });
        this.client.connect();
    }
    static getInstance() {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }
    async set(key, value) {
        await this.client.set(key, value);
    }
    async get(key) {
        return await this.client.get(key);
    }
    async lPush(key, value) {
        return await this.client.lPush(key, value);
    }
    async rPop(key) {
        return await this.client.rPop(key);
    }
    async lLen(key) {
        return await this.client.lLen(key);
    }
    async lIndex(key, index) {
        return await this.client.lIndex(key, index);
    }
    async del(key) {
        return await this.client.del(key);
    }
    async expire(key, seconds) {
        return await this.client.expire(key, seconds);
    }
}
exports.RedisService = RedisService;
//# sourceMappingURL=RedisService.js.map