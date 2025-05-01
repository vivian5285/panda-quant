"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyMonitorService = void 0;
const logger_1 = require("../utils/logger");
class StrategyMonitorService {
    constructor() {
        this.performances = new Map();
        this.updateCallbacks = new Map();
    }
    static getInstance() {
        if (!StrategyMonitorService.instance) {
            StrategyMonitorService.instance = new StrategyMonitorService();
        }
        return StrategyMonitorService.instance;
    }
    startMonitoring(strategyId, userId) {
        const key = this.getKey(strategyId, userId);
        if (!this.performances.has(key)) {
            this.performances.set(key, {
                strategyId,
                userId,
                status: 'running',
                startTime: new Date(),
                currentReturn: 0,
                maxDrawdown: 0,
                dailyReturn: 0,
                totalTrades: 0,
                winRate: 0,
                lastUpdate: new Date()
            });
            logger_1.logger.info(`Started monitoring strategy ${strategyId} for user ${userId}`);
        }
    }
    updatePerformance(strategyId, userId, update) {
        const key = this.getKey(strategyId, userId);
        const current = this.performances.get(key);
        if (current) {
            const updated = Object.assign(Object.assign(Object.assign({}, current), update), { lastUpdate: new Date() });
            this.performances.set(key, updated);
            this.notifyUpdate(key, updated);
            logger_1.logger.info(`Updated performance for strategy ${strategyId}`);
        }
    }
    getPerformance(strategyId, userId) {
        return this.performances.get(this.getKey(strategyId, userId));
    }
    getAllPerformances(userId) {
        if (userId) {
            return Array.from(this.performances.values())
                .filter(performance => performance.userId === userId);
        }
        return Array.from(this.performances.values());
    }
    subscribeToUpdates(strategyId, userId, callback) {
        const key = this.getKey(strategyId, userId);
        this.updateCallbacks.set(key, callback);
    }
    unsubscribeFromUpdates(strategyId, userId) {
        const key = this.getKey(strategyId, userId);
        this.updateCallbacks.delete(key);
    }
    getKey(strategyId, userId) {
        return `${strategyId}:${userId}`;
    }
    notifyUpdate(key, performance) {
        const callback = this.updateCallbacks.get(key);
        if (callback) {
            callback(performance);
        }
    }
}
exports.StrategyMonitorService = StrategyMonitorService;
