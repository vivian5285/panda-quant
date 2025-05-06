"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.set(key, value);
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.get(key);
        });
    }
    lPush(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.lPush(key, value);
        });
    }
    rPop(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.rPop(key);
        });
    }
    lLen(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.lLen(key);
        });
    }
    lIndex(key, index) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.lIndex(key, index);
        });
    }
    del(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.del(key);
        });
    }
    expire(key, seconds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.expire(key, seconds);
        });
    }
}
exports.RedisService = RedisService;
//# sourceMappingURL=RedisService.js.map