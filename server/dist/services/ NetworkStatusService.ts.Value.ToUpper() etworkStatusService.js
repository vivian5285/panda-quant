"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkStatusService = void 0;
const ws_1 = require("ws");
const logger_1 = require("../utils/logger");
const events_1 = require("events");
const NetworkStatus_1 = require("../models/NetworkStatus");
class NetworkStatusService extends events_1.EventEmitter {
    constructor(io) {
        super();
        this.statusMap = new Map();
        this.wsConnections = new Map();
        this.monitoringInterval = null;
        this.status = 'online';
        this.io = io;
        this.wsServer = new ws_1.WebSocketServer({ port: 8082 });
        this.clients = new Map();
        this.setupWebSocketServer(this.wsServer);
        this.model = NetworkStatus_1.NetworkStatus;
        this.initializeNetworks();
        this.startMonitoring();
    }
    static getInstance(io) {
        if (!NetworkStatusService.instance) {
            if (!io) {
                throw new Error('Socket.IO server instance is required for first initialization');
            }
            NetworkStatusService.instance = new NetworkStatusService(io);
        }
        return NetworkStatusService.instance;
    }
    initializeNetworks() {
        const networks = ['ethereum', 'bitcoin', 'binance'];
        networks.forEach(network => {
            const initialStatus = {
                network,
                status: 'checking',
                lastChecked: new Date(),
                blockHeight: 0,
                latency: 0,
                type: 'api',
                responseTime: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            this.statusMap.set(network, initialStatus);
        });
    }
    startMonitoring() {
        this.monitoringInterval = setInterval(async () => {
            try {
                await this.checkAllNetworks();
            }
            catch (error) {
                logger_1.logger.error('Network monitoring error:', error);
            }
        }, 30000);
    }
    async checkNetwork(network) {
        try {
            const status = await this.performNetworkCheck(network);
            this.statusMap.set(network, status);
            this.broadcastStatus(network);
        }
        catch (error) {
            logger_1.logger.error(`Error checking network ${network}:`, error);
            const currentStatus = this.statusMap.get(network);
            if (currentStatus) {
                const updatedStatus = {
                    ...currentStatus,
                    status: 'error',
                    error: error instanceof Error ? error.message : 'Unknown error',
                    updatedAt: new Date()
                };
                this.statusMap.set(network, updatedStatus);
                this.broadcastStatus(network);
            }
        }
    }
    async performNetworkCheck(network) {
        try {
            const startTime = Date.now();
            // 检查网络状态的具体实现
            const responseTime = Date.now() - startTime;
            const updatedStatus = await this.model.findOneAndUpdate({ network }, {
                status: 'healthy',
                network,
                type: 'api',
                lastChecked: new Date(),
                responseTime,
                updatedAt: new Date()
            }, { upsert: true, new: true });
            return updatedStatus;
        }
        catch (error) {
            logger_1.logger.error(`Network status check failed for ${network}:`, error);
            const errorStatus = await this.model.findOneAndUpdate({ network }, {
                status: 'error',
                network,
                type: 'api',
                lastChecked: new Date(),
                responseTime: 0,
                error: error instanceof Error ? error.message : 'Unknown error',
                updatedAt: new Date()
            }, { upsert: true, new: true });
            return errorStatus;
        }
    }
    broadcastStatus(network) {
        const status = this.statusMap.get(network);
        if (status) {
            this.io.emit('networkStatus', status);
        }
    }
    getNetworkStatus(network) {
        return this.statusMap.get(network);
    }
    getAllStatuses() {
        return Array.from(this.statusMap.values());
    }
    getOverallStatus() {
        const statuses = this.getAllStatuses();
        return statuses.every(s => s.status === 'online') ? 'online' : 'offline';
    }
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
    }
    setupWebSocketServer(server) {
        server.on('connection', (ws) => {
            const clientId = Math.random().toString(36).substring(7);
            this.clients.set(clientId, ws);
            ws.on('close', () => {
                this.clients.delete(clientId);
            });
        });
    }
    async notifyNetworkStatus(userId, status) {
        this.io.to(userId.toString()).emit('network_status', {
            userId,
            status
        });
    }
    setNetworkStatus(status) {
        this.status = status;
        this.emit('statusChange', status);
        this.io.emit('networkStatus', status);
    }
    getCurrentStatus() {
        return this.status;
    }
    async checkAllNetworks() {
        for (const [network, status] of this.statusMap) {
            try {
                await this.checkNetwork(network);
            }
            catch (error) {
                logger_1.logger.error(`Network check failed for ${network}:`, error);
                const updatedStatus = {
                    network: status.network,
                    status: 'error',
                    lastChecked: new Date(),
                    latency: status.latency,
                    type: status.type,
                    responseTime: status.responseTime,
                    error: error.message,
                    createdAt: status.createdAt,
                    updatedAt: new Date()
                };
                this.statusMap.set(network, updatedStatus);
            }
        }
    }
    async updateStatus(network, status) {
        const currentStatus = this.statusMap.get(network) || await this.checkNetworkStatus(network);
        const updatedStatus = await NetworkStatus_1.NetworkStatus.findOneAndUpdate({ network }, { ...currentStatus, ...status, updatedAt: new Date() }, { new: true });
        if (updatedStatus) {
            this.statusMap.set(network, updatedStatus);
            return updatedStatus;
        }
        throw new Error(`Failed to update status for network ${network}`);
    }
    async handleError(network, error) {
        return this.updateStatus(network, {
            status: 'error',
            error: error.message,
            lastChecked: new Date(),
            type: 'api',
            responseTime: 0
        });
    }
    async checkNetworkStatus(network) {
        try {
            const status = await NetworkStatus_1.NetworkStatus.findOneAndUpdate({ network }, {
                network,
                status: 'checking',
                lastChecked: new Date(),
                blockHeight: 0,
                latency: 0,
                type: 'api',
                responseTime: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            }, { upsert: true, new: true });
            this.statusMap.set(network, status);
            return status;
        }
        catch (error) {
            console.error('Error checking network status:', error);
            throw error;
        }
    }
    addConnection(id, ws) {
        this.wsConnections.set(id, ws);
    }
    removeConnection(id) {
        this.wsConnections.delete(id);
    }
    async updateNetworkStatus(data) {
        try {
            const updatedStatus = await NetworkStatus_1.NetworkStatus.findOneAndUpdate({ network: data.network, type: data.type }, { ...data, updatedAt: new Date() }, { upsert: true, new: true });
            return updatedStatus;
        }
        catch (error) {
            logger_1.logger.error('Error updating network status:', error);
            throw error;
        }
    }
    async getNetworkStatus(network, type) {
        try {
            const status = await NetworkStatus_1.NetworkStatus.findOne({ network, type });
            return status;
        }
        catch (error) {
            logger_1.logger.error('Error getting network status:', error);
            throw error;
        }
    }
}
exports.NetworkStatusService = NetworkStatusService;
//# sourceMappingURL=%20NetworkStatusService.ts.Value.ToUpper()%20etworkStatusService.js.map