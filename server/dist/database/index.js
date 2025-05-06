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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectRedis = exports.connectRedis = exports.redis = exports.disconnectMongoDB = exports.connectMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const redis_1 = require("redis");
const logger_1 = require("../utils/logger");
const config_1 = require("../config");
// MongoDB 连接
const connectMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(config_1.config.mongodb.uri);
        logger_1.logger.info('MongoDB connected successfully');
    }
    catch (error) {
        logger_1.logger.error('MongoDB connection error:', error);
        process.exit(1);
    }
});
exports.connectMongoDB = connectMongoDB;
const disconnectMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.disconnect();
        logger_1.logger.info('MongoDB disconnected successfully');
    }
    catch (error) {
        logger_1.logger.error('MongoDB disconnection error:', error);
        process.exit(1);
    }
});
exports.disconnectMongoDB = disconnectMongoDB;
// Redis 连接
exports.redis = (0, redis_1.createClient)({
    url: config_1.config.redis.url,
    password: config_1.config.redis.password
});
exports.redis.on('error', (err) => logger_1.logger.error('Redis Client Error', err));
exports.redis.on('connect', () => logger_1.logger.info('Redis connected successfully'));
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.redis.connect();
    }
    catch (error) {
        logger_1.logger.error('Redis connection error:', error);
        process.exit(1);
    }
});
exports.connectRedis = connectRedis;
const disconnectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.redis.disconnect();
        logger_1.logger.info('Redis disconnected successfully');
    }
    catch (error) {
        logger_1.logger.error('Redis disconnection error:', error);
        process.exit(1);
    }
});
exports.disconnectRedis = disconnectRedis;
//# sourceMappingURL=index.js.map