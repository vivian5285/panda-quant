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
exports.redis = void 0;
const redis_1 = require("redis");
const config_1 = require("./config");
const logger_1 = require("./utils/logger");
exports.redis = (0, redis_1.createClient)({
    url: config_1.config.redis.url
});
exports.redis.on('error', (err) => {
    logger_1.logger.error('Redis Client Error:', err);
});
exports.redis.on('connect', () => {
    logger_1.logger.info('Redis Client Connected');
});
// 初始化连接
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.redis.connect();
    }
    catch (error) {
        logger_1.logger.error('Redis connection failed:', error);
    }
}))();
//# sourceMappingURL=db.js.map