import { Strategy } from '../models/Strategy';
import { logger } from '../utils/logger';
export var StrategyStatus;
(function (StrategyStatus) {
    StrategyStatus["ACTIVE"] = "active";
    StrategyStatus["INACTIVE"] = "inactive";
    StrategyStatus["PAUSED"] = "paused";
})(StrategyStatus || (StrategyStatus = {}));
export class StrategyService {
    constructor() { }
    static getInstance() {
        if (!StrategyService.instance) {
            StrategyService.instance = new StrategyService();
        }
        return StrategyService.instance;
    }
    async createStrategy(strategy) {
        try {
            const newStrategy = new Strategy(strategy);
            return await newStrategy.save();
        }
        catch (error) {
            logger.error('Error creating strategy:', error);
            throw error;
        }
    }
    async getStrategies(userId) {
        try {
            return await Strategy.find({ userId });
        }
        catch (error) {
            logger.error('Error getting strategies:', error);
            throw error;
        }
    }
    async getStrategy(id) {
        try {
            return await Strategy.findById(id);
        }
        catch (error) {
            logger.error('Error getting strategy:', error);
            throw error;
        }
    }
    async updateStrategy(id, updates) {
        try {
            return await Strategy.findByIdAndUpdate(id, updates, { new: true });
        }
        catch (error) {
            logger.error('Error updating strategy:', error);
            throw error;
        }
    }
    async deleteStrategy(id) {
        try {
            return await Strategy.findByIdAndUpdate(id, { status: StrategyStatus.INACTIVE }, { new: true });
        }
        catch (error) {
            logger.error('Error deleting strategy:', error);
            throw error;
        }
    }
    async getStrategyPerformance(strategyId) {
        try {
            const strategy = await this.getStrategy(strategyId);
            if (!strategy) {
                throw new Error('Strategy not found');
            }
            // TODO: 实现实际的性能计算逻辑
            return {
                totalProfit: 0,
                winRate: 0,
                trades: []
            };
        }
        catch (error) {
            logger.error('Error getting strategy performance:', error);
            throw error;
        }
    }
    async getAllStrategies() {
        try {
            return await Strategy.find();
        }
        catch (error) {
            logger.error('Error getting all strategies:', error);
            throw error;
        }
    }
    async getStrategiesByUser(userId) {
        try {
            return await Strategy.find({ userId });
        }
        catch (error) {
            logger.error('Error getting strategies by user:', error);
            throw error;
        }
    }
    async getActiveStrategies() {
        try {
            return await Strategy.find({ status: StrategyStatus.ACTIVE });
        }
        catch (error) {
            logger.error('Error getting active strategies:', error);
            throw error;
        }
    }
    async getPopularStrategies(limit = 10) {
        try {
            return await Strategy.find()
                .sort({ followers: -1 })
                .limit(limit);
        }
        catch (error) {
            logger.error('Error getting popular strategies:', error);
            throw error;
        }
    }
}
//# sourceMappingURL=StrategyService.js.map