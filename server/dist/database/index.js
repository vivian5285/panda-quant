"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectRedis = exports.connectRedis = exports.redis = exports.disconnectMongoDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const redis_1 = require("redis");
const logger_1 = require("../utils/logger");
const config_1 = require("../config");
// MongoDB 连接
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(config_1.config.mongoUri);
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const disconnectMongoDB = async () => {
    try {
        await mongoose_1.default.disconnect();
        logger_1.logger.info('MongoDB disconnected successfully');
    }
    catch (error) {
        logger_1.logger.error('MongoDB disconnection error:', error);
        process.exit(1);
    }
};
exports.disconnectMongoDB = disconnectMongoDB;
// Redis 连接
exports.redis = (0, redis_1.createClient)({
    url: config_1.config.redis.url,
    password: config_1.config.redis.password
});
exports.redis.on('error', (err) => logger_1.logger.error('Redis Client Error', err));
exports.redis.on('connect', () => logger_1.logger.info('Redis connected successfully'));
const connectRedis = async () => {
    try {
        await exports.redis.connect();
    }
    catch (error) {
        logger_1.logger.error('Redis connection error:', error);
        process.exit(1);
    }
};
exports.connectRedis = connectRedis;
const disconnectRedis = async () => {
    try {
        await exports.redis.disconnect();
        logger_1.logger.info('Redis disconnected successfully');
    }
    catch (error) {
        logger_1.logger.error('Redis disconnection error:', error);
        process.exit(1);
    }
};
exports.disconnectRedis = disconnectRedis;
//# sourceMappingURL=index.js.map