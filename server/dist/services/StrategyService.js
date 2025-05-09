"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyService = void 0;
const strategy_model_1 = require("../models/strategy.model");
const trade_model_1 = __importDefault(require("../models/trade.model"));
const mongoose_1 = require("mongoose");
const logger_1 = require("../utils/logger");
const Enums_1 = require("../types/Enums");
const AppError_1 = require("../utils/AppError");
class StrategyService {
    constructor() { }
    static getInstance() {
        if (!StrategyService.instance) {
            StrategyService.instance = new StrategyService();
        }
        return StrategyService.instance;
    }
    convertToITrade(trade) {
        const tradeObject = trade.toObject();
        return {
            userId: tradeObject.userId,
            strategyId: tradeObject.strategyId,
            symbol: tradeObject.symbol,
            type: tradeObject.type,
            side: tradeObject.side,
            quantity: tradeObject.quantity,
            price: tradeObject.price,
            status: tradeObject.status,
            executedAt: tradeObject.executedAt,
            metadata: tradeObject.metadata,
            createdAt: tradeObject.createdAt,
            updatedAt: tradeObject.updatedAt
        };
    }
    convertToIStrategy(strategy) {
        const strategyObject = strategy.toObject();
        return {
            userId: strategyObject.userId,
            name: strategyObject.name,
            description: strategyObject.description,
            type: strategyObject.type,
            status: strategyObject.status,
            config: strategyObject.config,
            performance: strategyObject.performance,
            metadata: strategyObject.metadata,
            createdAt: strategyObject.createdAt,
            updatedAt: strategyObject.updatedAt
        };
    }
    async createStrategy(strategyData) {
        try {
            const strategy = new strategy_model_1.Strategy({
                ...strategyData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            const savedStrategy = await strategy.save();
            return this.convertToIStrategy(savedStrategy);
        }
        catch (error) {
            logger_1.logger.error('Error creating strategy:', error);
            throw new AppError_1.AppError('Failed to create strategy', 500);
        }
    }
    async getStrategyById(id) {
        try {
            const strategy = await strategy_model_1.Strategy.findById(id);
            if (!strategy)
                return null;
            return this.convertToIStrategy(strategy);
        }
        catch (error) {
            logger_1.logger.error(`Error getting strategy ${id}:`, error);
            throw new AppError_1.AppError('Failed to get strategy', 500);
        }
    }
    async updateStrategy(id, updates) {
        try {
            const strategy = await strategy_model_1.Strategy.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true });
            if (!strategy)
                return null;
            return this.convertToIStrategy(strategy);
        }
        catch (error) {
            logger_1.logger.error(`Error updating strategy ${id}:`, error);
            throw new AppError_1.AppError('Failed to update strategy', 500);
        }
    }
    async deleteStrategy(id) {
        try {
            const result = await strategy_model_1.Strategy.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            logger_1.logger.error(`Error deleting strategy ${id}:`, error);
            throw new AppError_1.AppError('Failed to delete strategy', 500);
        }
    }
    async getAllStrategies() {
        try {
            const strategies = await strategy_model_1.Strategy.find();
            return strategies.map(strategy => this.convertToIStrategy(strategy));
        }
        catch (error) {
            logger_1.logger.error('Error getting all strategies:', error);
            throw new AppError_1.AppError('Failed to get strategies', 500);
        }
    }
    async startStrategy(strategy) {
        try {
            // 实现启动策略的逻辑
            logger_1.logger.info(`Strategy ${strategy._id} started`);
        }
        catch (error) {
            logger_1.logger.error(`Error starting strategy ${strategy._id}:`, error);
            throw new AppError_1.AppError('Failed to start strategy', 500);
        }
    }
    async stopStrategy(strategy) {
        try {
            // 实现停止策略的逻辑
            logger_1.logger.info(`Strategy ${strategy._id} stopped`);
        }
        catch (error) {
            logger_1.logger.error(`Error stopping strategy ${strategy._id}:`, error);
            throw new AppError_1.AppError('Failed to stop strategy', 500);
        }
    }
    async pauseStrategy(strategy) {
        try {
            // 实现暂停策略的逻辑
            logger_1.logger.info(`Strategy ${strategy._id} paused`);
        }
        catch (error) {
            logger_1.logger.error(`Error pausing strategy ${strategy._id}:`, error);
            throw new AppError_1.AppError('Failed to pause strategy', 500);
        }
    }
    async resumeStrategy(strategy) {
        try {
            // 实现恢复策略的逻辑
            logger_1.logger.info(`Strategy ${strategy._id} resumed`);
        }
        catch (error) {
            logger_1.logger.error(`Error resuming strategy ${strategy._id}:`, error);
            throw new AppError_1.AppError('Failed to resume strategy', 500);
        }
    }
    async getStrategiesByUser(userId) {
        try {
            const strategies = await strategy_model_1.Strategy.find({ userId: new mongoose_1.Types.ObjectId(userId) });
            return strategies.map(strategy => this.convertToIStrategy(strategy));
        }
        catch (error) {
            logger_1.logger.error('Error getting strategies by user:', error);
            throw new AppError_1.AppError('Failed to get user strategies', 500);
        }
    }
    async getActiveStrategies() {
        try {
            const strategies = await strategy_model_1.Strategy.find({ status: Enums_1.StrategyStatus.ACTIVE });
            return strategies.map(strategy => this.convertToIStrategy(strategy));
        }
        catch (error) {
            logger_1.logger.error('Error getting active strategies:', error);
            throw new AppError_1.AppError('Failed to get active strategies', 500);
        }
    }
    async getPopularStrategies(limit = 10) {
        try {
            const strategies = await strategy_model_1.Strategy.find()
                .sort({ followers: -1 })
                .limit(limit);
            return strategies.map(strategy => this.convertToIStrategy(strategy));
        }
        catch (error) {
            logger_1.logger.error('Error getting popular strategies:', error);
            throw new AppError_1.AppError('Failed to get popular strategies', 500);
        }
    }
    async getTradesByStrategyId(strategyId) {
        try {
            const trades = await trade_model_1.default.find({ strategyId: new mongoose_1.Types.ObjectId(strategyId) });
            return trades.map(trade => this.convertToITrade(trade));
        }
        catch (error) {
            logger_1.logger.error('Error getting trades by strategy id:', error);
            throw new AppError_1.AppError('Failed to get strategy trades', 500);
        }
    }
}
exports.StrategyService = StrategyService;
//# sourceMappingURL=StrategyService.js.map