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
exports.connectRedis = connectRedis;
exports.disconnectRedis = disconnectRedis;
exports.checkRedisHealth = checkRedisHealth;
const redis_1 = require("redis");
const config_1 = require("../../config");
exports.redis = (0, redis_1.createClient)(Object.assign({ url: `redis://${config_1.config.redis.host}:${config_1.config.redis.port}` }, (config_1.config.redis.password ? { password: config_1.config.redis.password } : {})));
exports.redis.on('error', (err) => console.error('Redis Client Error', err));
exports.redis.on('connect', () => console.log('Connected to Redis'));
function connectRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.redis.connect();
        }
        catch (error) {
            console.error('Failed to connect to Redis:', error);
            throw error;
        }
    });
}
function disconnectRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.redis.disconnect();
        }
        catch (error) {
            console.error('Failed to disconnect from Redis:', error);
            throw error;
        }
    });
}
function checkRedisHealth() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.redis.ping();
            return true;
        }
        catch (error) {
            console.error('Redis health check failed:', error);
            return false;
        }
    });
}
