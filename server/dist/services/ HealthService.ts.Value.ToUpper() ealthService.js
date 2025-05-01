"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = exports.healthService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const redis_1 = require("redis");
const config_1 = require("../config");
const NetworkStatus_1 = require("../models/NetworkStatus");
const logger_1 = require("../utils/logger");
const events_1 = require("events");
const HealthService_1 = require("./HealthService");
const healthLogger = (0, logger_1.createLogger)('Health');
exports.healthService = HealthService_1.HealthService.getInstance();
class HealthService extends events_1.EventEmitter {
    constructor() {
        super();
        this.networkStatusModel = NetworkStatus_1.NetworkStatus;
        this.status = new Map();
        this.initializeStatus();
    }
    static getInstance() {
        if (!HealthService_1.HealthService.instance) {
            HealthService_1.HealthService.instance = new HealthService_1.HealthService();
        }
        return HealthService_1.HealthService.instance;
    }
    initializeStatus() {
        this.status.set('database', false);
        this.status.set('redis', false);
        this.status.set('api', false);
        healthLogger.info('Health status initialized');
    }
    setDatabaseStatus(isHealthy) {
        this.status.set('database', isHealthy);
        healthLogger.info(`Database health status updated: ${isHealthy}`);
    }
    setRedisStatus(isHealthy) {
        this.status.set('redis', isHealthy);
        healthLogger.info(`Redis health status updated: ${isHealthy}`);
    }
    setApiStatus(isHealthy) {
        this.status.set('api', isHealthy);
        healthLogger.info(`API health status updated: ${isHealthy}`);
    }
    getDatabaseStatus() {
        return this.status.get('database') || false;
    }
    getRedisStatus() {
        return this.status.get('redis') || false;
    }
    getApiStatus() {
        return this.status.get('api') || false;
    }
    getOverallStatus() {
        return Array.from(this.status.values()).every(status => status);
    }
    getAllStatus() {
        const result = {};
        this.status.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    }
    async checkDatabaseHealth() {
        try {
            if (!mongoose_1.default.connection.db) {
                await this.updateNetworkStatus('database', 'offline', 'Database connection not established');
                return { status: 'unhealthy', error: 'Database connection not established' };
            }
            await mongoose_1.default.connection.db.admin().ping();
            await this.updateNetworkStatus('database', 'online');
            return { status: 'healthy' };
        }
        catch (error) {
            console.error('Database health check failed:', error);
            await this.updateNetworkStatus('database', 'error', error instanceof Error ? error.message : 'Unknown error');
            return { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }
    async checkRedisHealth() {
        try {
            const client = (0, redis_1.createClient)({ url: config_1.config.redis.url });
            await client.connect();
            await client.ping();
            await client.quit();
            await this.updateNetworkStatus('redis', 'online');
            return true;
        }
        catch (error) {
            console.error('Redis health check failed:', error);
            await this.updateNetworkStatus('redis', 'error', error instanceof Error ? error.message : 'Unknown error');
            return false;
        }
    }
    async checkUserApiHealth() {
        try {
            const response = await fetch(`${config_1.config.api.userBaseUrl}/health`);
            const data = await response.json();
            await this.updateNetworkStatus('api', data.status === 'ok' ? 'online' : 'error', data.message);
            return {
                status: data.status === 'ok' ? 'healthy' : 'unhealthy',
                error: data.status === 'ok' ? undefined : data.message
            };
        }
        catch (error) {
            console.error('User API health check failed:', error);
            await this.updateNetworkStatus('api', 'error', error instanceof Error ? error.message : 'Unknown error');
            return { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }
    async checkAdminApiHealth() {
        try {
            const response = await fetch(`${config_1.config.api.adminBaseUrl}/health`);
            const data = await response.json();
            await this.updateNetworkStatus('api', data.status === 'ok' ? 'online' : 'error', data.message);
            return {
                status: data.status === 'ok' ? 'healthy' : 'unhealthy',
                error: data.status === 'ok' ? undefined : data.message
            };
        }
        catch (error) {
            console.error('Admin API health check failed:', error);
            await this.updateNetworkStatus('api', 'error', error instanceof Error ? error.message : 'Unknown error');
            return { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }
    async checkStrategyEngineHealth() {
        try {
            const response = await fetch(`${config_1.config.api.strategyEngineUrl}/health`);
            const data = await response.json();
            await this.updateNetworkStatus('websocket', data.status === 'ok' ? 'online' : 'error', data.message);
            return {
                status: data.status === 'ok' ? 'healthy' : 'unhealthy',
                error: data.status === 'ok' ? undefined : data.message
            };
        }
        catch (error) {
            console.error('Strategy Engine health check failed:', error);
            await this.updateNetworkStatus('websocket', 'error', error instanceof Error ? error.message : 'Unknown error');
            return { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }
    async updateNetworkStatus(type, status, error) {
        try {
            await this.networkStatusModel.findOneAndUpdate({ type }, {
                status,
                lastChecked: new Date(),
                error,
                responseTime: Date.now()
            }, { upsert: true });
        }
        catch (error) {
            console.error('Failed to update network status:', error);
        }
    }
    async getNetworkStatus() {
        try {
            return await this.networkStatusModel.find();
        }
        catch (error) {
            console.error('Failed to get network status:', error);
            return [];
        }
    }
}
exports.HealthService = HealthService;
//# sourceMappingURL=%20HealthService.ts.Value.ToUpper()%20ealthService.js.map