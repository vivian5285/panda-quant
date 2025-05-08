"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyService = void 0;
const strategy_model_1 = require("../models/strategy.model");
const trade_model_1 = require("../models/trade.model");
const logger_1 = require("../utils/logger");
const Enums_1 = require("../types/Enums");
class StrategyService {
    constructor() { }
    static getInstance() {
        if (!StrategyService.instance) {
            StrategyService.instance = new StrategyService();
        }
        return StrategyService.instance;
    }
    async createStrategy(strategyData) {
        const strategy = new strategy_model_1.Strategy(strategyData);
        const savedStrategy = await strategy.save();
        return savedStrategy.toObject();
    }
    async getStrategyById(id) {
        const strategy = await strategy_model_1.Strategy.findById(id);
        return strategy ? strategy.toObject() : null;
    }
    async updateStrategy(id, updates) {
        const strategy = await strategy_model_1.Strategy.findByIdAndUpdate(id, updates, { new: true });
        return strategy ? strategy.toObject() : null;
    }
    async deleteStrategy(id) {
        const result = await strategy_model_1.Strategy.findByIdAndDelete(id);
        return !!result;
    }
    async getAllStrategies() {
        const strategies = await strategy_model_1.Strategy.find();
        return strategies.map(strategy => strategy.toObject());
    }
    async startStrategy(strategy) {
        try {
            // 实现启动策略的逻辑
            logger_1.logger.info(`Strategy ${strategy._id} started`);
        }
        catch (error) {
            logger_1.logger.error(`Error starting strategy ${strategy._id}:`, error);
            throw error;
        }
    }
    async stopStrategy(strategy) {
        try {
            // 实现停止策略的逻辑
            logger_1.logger.info(`Strategy ${strategy._id} stopped`);
        }
        catch (error) {
            logger_1.logger.error(`Error stopping strategy ${strategy._id}:`, error);
            throw error;
        }
    }
    async pauseStrategy(strategy) {
        try {
            // 实现暂停策略的逻辑
            logger_1.logger.info(`Strategy ${strategy._id} paused`);
        }
        catch (error) {
            logger_1.logger.error(`Error pausing strategy ${strategy._id}:`, error);
            throw error;
        }
    }
    async resumeStrategy(strategy) {
        try {
            // 实现恢复策略的逻辑
            logger_1.logger.info(`Strategy ${strategy._id} resumed`);
        }
        catch (error) {
            logger_1.logger.error(`Error resuming strategy ${strategy._id}:`, error);
            throw error;
        }
    }
    async getStrategiesByUser(userId) {
        try {
            const strategies = await strategy_model_1.Strategy.find({ userId });
            return strategies.map(strategy => strategy.toObject());
        }
        catch (error) {
            logger_1.logger.error('Error getting strategies by user:', error);
            throw error;
        }
    }
    async getActiveStrategies() {
        try {
            const strategies = await strategy_model_1.Strategy.find({ status: Enums_1.StrategyStatus.ACTIVE });
            return strategies.map(strategy => strategy.toObject());
        }
        catch (error) {
            logger_1.logger.error('Error getting active strategies:', error);
            throw error;
        }
    }
    async getPopularStrategies(limit = 10) {
        try {
            const strategies = await strategy_model_1.Strategy.find()
                .sort({ followers: -1 })
                .limit(limit);
            return strategies.map(strategy => strategy.toObject());
        }
        catch (error) {
            logger_1.logger.error('Error getting popular strategies:', error);
            throw error;
        }
    }
    async getStrategyTrades(strategyId) {
        try {
            const trades = await trade_model_1.Trade.find({ strategyId });
            return trades.map(trade => trade.toObject());
        }
        catch (error) {
            logger_1.logger.error('Error getting strategy trades:', error);
            throw error;
        }
    }
}
exports.StrategyService = StrategyService;
//# sourceMappingURL=StrategyService.js.map