"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("../config");
class RedisService {
    constructor() {
        this.client = new ioredis_1.default({
            host: config_1.config.redis.host,
            port: config_1.config.redis.port,
            password: config_1.config.redis.password
        });
    }
    static getInstance() {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }
    async lpush(key, value) {
        return this.client.lpush(key, value);
    }
    async rpop(key) {
        return this.client.rpop(key);
    }
    async llen(key) {
        return this.client.llen(key);
    }
    async lindex(key, index) {
        return this.client.lindex(key, index);
    }
    async del(key) {
        return this.client.del(key);
    }
}
exports.RedisService = RedisService;
//# sourceMappingURL=redis.js.map