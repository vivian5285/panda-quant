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
    checkHealth() {
        return __awaiter(this, void 0, void 0, function* () {
            const components = {
                database: yield this.checkDatabase(),
                api: yield this.checkApi(),
                redis: yield this.checkRedis(),
                websocket: yield this.checkWebSocket(),
                userApi: { status: 'online' },
                adminApi: { status: 'online' },
                strategyEngine: { status: 'online' }
            };
            const status = this.determineOverallStatus(components);
            return { status, components };
        });
    }
    checkDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = Date.now();
                if (!mongoose_1.default.connection.readyState) {
                    throw new Error('Database not connected');
                }
                if (!mongoose_1.default.connection.db) {
                    throw new Error('Database connection not established');
                }
                yield mongoose_1.default.connection.db.admin().ping();
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                yield this.updateNetworkComponentStatus('database', 'online', undefined, responseTime);
                return { status: 'online', message: `Response time: ${responseTime}ms` };
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                yield this.updateNetworkComponentStatus('database', 'offline', errorMessage);
                return { status: 'offline', message: errorMessage };
            }
        });
    }
    checkApi() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = Date.now();
                yield axios_1.default.get(`${config_1.config.server.port}/health`);
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                yield this.updateNetworkComponentStatus('api', 'online', undefined, responseTime);
                return { status: 'online', message: `Response time: ${responseTime}ms` };
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                yield this.updateNetworkComponentStatus('api', 'offline', errorMessage);
                return { status: 'offline', message: errorMessage };
            }
        });
    }
    checkRedis() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = Date.now();
                const client = (0, redis_1.createClient)({
                    url: config_1.config.redis.url,
                    password: config_1.config.redis.password
                });
                yield client.connect();
                yield client.ping();
                yield client.quit();
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                yield this.updateNetworkComponentStatus('redis', 'online', undefined, responseTime);
                return { status: 'online', message: `Response time: ${responseTime}ms` };
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                yield this.updateNetworkComponentStatus('redis', 'offline', errorMessage);
                return { status: 'offline', message: errorMessage };
            }
        });
    }
    checkWebSocket() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = Date.now();
                // Add WebSocket health check logic here
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                yield this.updateNetworkComponentStatus('websocket', 'online', undefined, responseTime);
                return { status: 'online', message: `Response time: ${responseTime}ms` };
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                yield this.updateNetworkComponentStatus('websocket', 'offline', errorMessage);
                return { status: 'offline', message: errorMessage };
            }
        });
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
    updateNetworkComponentStatus(type, status, error, responseTime) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.networkStatusModel.create({
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
        });
    }
    getNetworkStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const statuses = yield this.networkStatusModel.find().sort({ updatedAt: -1 });
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
        });
    }
    createHealth(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const health = new health_model_1.Health(data);
                yield health.save();
                return this.mapToIHealth(health);
            }
            catch (error) {
                logger_1.logger.error('Error creating health record:', error);
                throw error;
            }
        });
    }
    getHealthById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const health = yield health_model_1.Health.findById(id);
                return health ? this.mapToIHealth(health) : null;
            }
            catch (error) {
                logger_1.logger.error('Error getting health by ID:', error);
                throw error;
            }
        });
    }
    updateHealth(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const health = yield health_model_1.Health.findByIdAndUpdate(id, data, { new: true });
                return health ? this.mapToIHealth(health) : null;
            }
            catch (error) {
                logger_1.logger.error('Error updating health:', error);
                throw error;
            }
        });
    }
    deleteHealth(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield health_model_1.Health.findByIdAndDelete(id);
                return !!result;
            }
            catch (error) {
                logger_1.logger.error('Error deleting health:', error);
                throw error;
            }
        });
    }
    checkDatabaseConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.connection.db) {
                    return false;
                }
                yield mongoose_1.default.connection.db.admin().ping();
                return true;
            }
            catch (error) {
                logger_1.logger.error('Database connection check failed:', error);
                return false;
            }
        });
    }
    getHealth() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const health = yield health_model_1.Health.findOne().sort({ createdAt: -1 });
                if (!health) {
                    throw new Error('No health record found');
                }
                return this.mapToIHealth(health);
            }
            catch (error) {
                logger_1.logger.error('Error getting health:', error);
                throw error;
            }
        });
    }
    updateHealthStatus(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const health = yield health_model_1.Health.findOneAndUpdate({}, data, { new: true, upsert: true });
                return this.mapToIHealth(health);
            }
            catch (error) {
                logger_1.logger.error('Error updating health status:', error);
                throw error;
            }
        });
    }
    updateHealthWithNetworkStatus(networkStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const health = yield health_model_1.Health.findOneAndUpdate({}, {
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
        });
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