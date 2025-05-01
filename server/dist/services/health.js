"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthService = exports.checkAdminApiHealth = exports.checkUserApiHealth = exports.checkRedisHealth = exports.checkDatabaseHealth = void 0;
exports.checkStrategyEngineHealth = checkStrategyEngineHealth;
const mongoose_1 = __importDefault(require("mongoose"));
const redis_1 = require("redis");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
const HealthService_1 = require("./HealthService");
const checkDatabaseHealth = async () => {
    try {
        if (!mongoose_1.default.connection.db) {
            return false;
        }
        await mongoose_1.default.connection.db.admin().ping();
        return true;
    }
    catch (error) {
        console.error('Database health check failed:', error);
        return false;
    }
};
exports.checkDatabaseHealth = checkDatabaseHealth;
const checkRedisHealth = async () => {
    try {
        const client = (0, redis_1.createClient)({
            url: config_1.config.redis.url
        });
        await client.connect();
        await client.ping();
        await client.quit();
        return true;
    }
    catch (error) {
        console.error('Redis health check failed:', error);
        return false;
    }
};
exports.checkRedisHealth = checkRedisHealth;
const checkUserApiHealth = async () => {
    try {
        const response = await axios_1.default.get(`${process.env['USER_API_URL']}/health`);
        return response.data.status === 'ok';
    }
    catch (error) {
        console.error('User API health check failed:', error);
        return false;
    }
};
exports.checkUserApiHealth = checkUserApiHealth;
const checkAdminApiHealth = async () => {
    try {
        const response = await axios_1.default.get(`${process.env['ADMIN_API_URL']}/health`);
        return response.data.status === 'ok';
    }
    catch (error) {
        console.error('Admin API health check failed:', error);
        return false;
    }
};
exports.checkAdminApiHealth = checkAdminApiHealth;
async function checkStrategyEngineHealth() {
    try {
        const response = await fetch(`${config_1.config.api.strategyEngineUrl}/health`);
        if (!response.ok) {
            throw new Error(`Strategy engine health check failed with status ${response.status}`);
        }
        return { status: 'healthy' };
    }
    catch (error) {
        logger_1.logger.error('Strategy engine health check failed:', error);
        return {
            status: 'unhealthy',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
exports.healthService = HealthService_1.HealthService.getInstance();
//# sourceMappingURL=health.js.map