"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthService = exports.HealthService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const redis_1 = require("redis");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const NetworkStatus_1 = __importDefault(require("../models/NetworkStatus"));
const logger_1 = require("../utils/logger");
const events_1 = require("events");
const health_model_1 = require("../models/health.model");
class HealthService extends events_1.EventEmitter {
    constructor() {
        super();
        this.networkStatusModel = NetworkStatus_1.default;
        this.status = new Map();
        this.initializeStatus();
    }
    static getInstance() {
        if (!HealthService.instance) {
            HealthService.instance = new HealthService();
        }
        return HealthService.instance;
    }
    initializeStatus() {
        this.status.set('database', false);
        this.status.set('redis', false);
        this.status.set('api', false);
        this.status.set('userApi', false);
        this.status.set('adminApi', false);
        this.status.set('strategyEngine', false);
        logger_1.logger.info('Health status initialized');
    }
    setDatabaseStatus(isHealthy) {
        this.status.set('database', isHealthy);
        logger_1.logger.info(`Database health status updated: ${isHealthy}`);
    }
    setRedisStatus(isHealthy) {
        this.status.set('redis', isHealthy);
        logger_1.logger.info(`Redis health status updated: ${isHealthy}`);
    }
    setApiStatus(isHealthy) {
        this.status.set('api', isHealthy);
        logger_1.logger.info(`API health status updated: ${isHealthy}`);
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
        return Object.fromEntries(this.status);
    }
    async checkHealth() {
        const components = {
            database: await this.checkDatabase(),
            api: await this.checkApi(),
            redis: await this.checkRedis(),
            websocket: await this.checkWebSocket(),
            userApi: { status: 'online' },
            adminApi: { status: 'online' },
            strategyEngine: { status: 'online' }
        };
        const status = this.determineOverallStatus(components);
        return { status, components };
    }
    async checkDatabase() {
        try {
            const startTime = Date.now();
            if (!mongoose_1.default.connection.readyState) {
                throw new Error('Database not connected');
            }
            if (!mongoose_1.default.connection.db) {
                throw new Error('Database connection not established');
            }
            await mongoose_1.default.connection.db.admin().ping();
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            await this.updateNetworkComponentStatus('database', 'online', undefined, responseTime);
            return { status: 'online', message: `Response time: ${responseTime}ms` };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            await this.updateNetworkComponentStatus('database', 'offline', errorMessage);
            return { status: 'offline', message: errorMessage };
        }
    }
    async checkApi() {
        try {
            const startTime = Date.now();
            await axios_1.default.get(`${config_1.config.server.port}/health`);
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            await this.updateNetworkComponentStatus('api', 'online', undefined, responseTime);
            return { status: 'online', message: `Response time: ${responseTime}ms` };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            await this.updateNetworkComponentStatus('api', 'offline', errorMessage);
            return { status: 'offline', message: errorMessage };
        }
    }
    async checkRedis() {
        try {
            const startTime = Date.now();
            const client = (0, redis_1.createClient)({
                url: config_1.config.redis.url,
                password: config_1.config.redis.password
            });
            await client.connect();
            await client.ping();
            await client.quit();
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            await this.updateNetworkComponentStatus('redis', 'online', undefined, responseTime);
            return { status: 'online', message: `Response time: ${responseTime}ms` };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            await this.updateNetworkComponentStatus('redis', 'offline', errorMessage);
            return { status: 'offline', message: errorMessage };
        }
    }
    async checkWebSocket() {
        try {
            const startTime = Date.now();
            // Add WebSocket health check logic here
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            await this.updateNetworkComponentStatus('websocket', 'online', undefined, responseTime);
            return { status: 'online', message: `Response time: ${responseTime}ms` };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            await this.updateNetworkComponentStatus('websocket', 'offline', errorMessage);
            return { status: 'offline', message: errorMessage };
        }
    }
    determineOverallStatus(components) {
        const onlineCount = Object.values(components).filter(c => c.status === 'online').length;
        const totalCount = Object.keys(components).length;
        if (onlineCount === totalCount)
            return 'healthy';
        if (onlineCount >= totalCount / 2)
            return 'degraded';
        return 'unhealthy';
    }
    async updateNetworkComponentStatus(type, status, error, responseTime) {
        try {
            await this.networkStatusModel.create({
                network: type,
                status,
                lastChecked: new Date(),
                latency: responseTime || 0,
                type,
                responseTime: responseTime || 0,
                error
            });
        }
        catch (error) {
            logger_1.logger.error('Error updating network status:', error);
        }
    }
    async getNetworkStatus() {
        try {
            const statuses = await this.networkStatusModel.find().sort({ updatedAt: -1 });
            return statuses.map(status => ({
                _id: status._id,
                network: status.network,
                type: status.type,
                status: status.status,
                lastChecked: status.lastChecked,
                latency: status.latency,
                responseTime: status.responseTime,
                error: status.error || undefined,
                createdAt: status.createdAt,
                updatedAt: status.updatedAt
            }));
        }
        catch (error) {
            logger_1.logger.error('Error getting network status:', error);
            throw error;
        }
    }
    async createHealth(data) {
        try {
            const health = new health_model_1.Health(data);
            await health.save();
            return this.mapToIHealth(health);
        }
        catch (error) {
            logger_1.logger.error('Error creating health record:', error);
            throw error;
        }
    }
    async getHealthById(id) {
        try {
            const health = await health_model_1.Health.findById(id);
            return health ? this.mapToIHealth(health) : null;
        }
        catch (error) {
            logger_1.logger.error('Error getting health by ID:', error);
            throw error;
        }
    }
    async updateHealth(id, data) {
        try {
            const health = await health_model_1.Health.findByIdAndUpdate(id, data, { new: true });
            return health ? this.mapToIHealth(health) : null;
        }
        catch (error) {
            logger_1.logger.error('Error updating health:', error);
            throw error;
        }
    }
    async deleteHealth(id) {
        try {
            const result = await health_model_1.Health.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            logger_1.logger.error('Error deleting health:', error);
            throw error;
        }
    }
    async checkDatabaseConnection() {
        try {
            if (!mongoose_1.default.connection.db) {
                return false;
            }
            await mongoose_1.default.connection.db.admin().ping();
            return true;
        }
        catch (error) {
            logger_1.logger.error('Database connection check failed:', error);
            return false;
        }
    }
    async getHealth() {
        try {
            const health = await health_model_1.Health.findOne().sort({ createdAt: -1 });
            if (!health) {
                throw new Error('No health record found');
            }
            return this.mapToIHealth(health);
        }
        catch (error) {
            logger_1.logger.error('Error getting health:', error);
            throw error;
        }
    }
    async updateHealthStatus(data) {
        try {
            const health = await health_model_1.Health.findOneAndUpdate({}, data, { new: true, upsert: true });
            return this.mapToIHealth(health);
        }
        catch (error) {
            logger_1.logger.error('Error updating health status:', error);
            throw error;
        }
    }
    async updateHealthWithNetworkStatus(networkStatus) {
        try {
            const health = await health_model_1.Health.findOneAndUpdate({}, {
                networkStatus,
                lastChecked: new Date(),
                updatedAt: new Date()
            }, { new: true, upsert: true });
            return this.mapToIHealth(health);
        }
        catch (error) {
            logger_1.logger.error('Error updating network status:', error);
            throw error;
        }
    }
    mapToIHealth(doc) {
        return {
            _id: doc._id.toString(),
            networkStatus: {
                _id: doc._id,
                network: 'api',
                type: 'api',
                status: 'online',
                lastChecked: doc.lastChecked,
                latency: 0,
                responseTime: 0,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt
            },
            lastChecked: doc.lastChecked,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }
}
exports.HealthService = HealthService;
exports.healthService = HealthService.getInstance();
//# sourceMappingURL=HealthService.js.map