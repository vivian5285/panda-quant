"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyService = void 0;
const strategy_model_1 = require("../../models/strategy.model");
const mongoose_1 = require("mongoose");
const logger_1 = require("../../utils/logger");
class StrategyService {
    constructor() { }
    static getInstance() {
        if (!StrategyService.instance) {
            StrategyService.instance = new StrategyService();
        }
        return StrategyService.instance;
    }
    async createStrategy(strategyData) {
        try {
            const strategy = new strategy_model_1.Strategy(strategyData);
            const savedStrategy = await strategy.save();
            return savedStrategy.toObject();
        }
        catch (error) {
            logger_1.logger.error('Error creating strategy:', error);
            throw error;
        }
    }
    async getStrategyById(id) {
        try {
            const strategy = await strategy_model_1.Strategy.findById(id);
            return strategy ? strategy.toObject() : null;
        }
        catch (error) {
            logger_1.logger.error('Error getting strategy by ID:', error);
            throw error;
        }
    }
    async getStrategyByUserId(userId) {
        try {
            const strategy = await strategy_model_1.Strategy.findOne({ userId: new mongoose_1.Types.ObjectId(userId) });
            return strategy ? strategy.toObject() : null;
        }
        catch (error) {
            logger_1.logger.error('Error getting strategy by user ID:', error);
            throw error;
        }
    }
    async updateStrategy(id, strategyData) {
        try {
            const strategy = await strategy_model_1.Strategy.findByIdAndUpdate(id, { $set: strategyData }, { new: true });
            return strategy ? strategy.toObject() : null;
        }
        catch (error) {
            logger_1.logger.error('Error updating strategy:', error);
            throw error;
        }
    }
    async deleteStrategy(id) {
        try {
            const result = await strategy_model_1.Strategy.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            logger_1.logger.error('Error deleting strategy:', error);
            throw error;
        }
    }
    async getAllStrategies() {
        try {
            const strategies = await strategy_model_1.Strategy.find();
            return strategies.map(strategy => strategy.toObject());
        }
        catch (error) {
            logger_1.logger.error('Error getting all strategies:', error);
            throw error;
        }
    }
}
exports.StrategyService = StrategyService;
//# sourceMappingURL=strategy.service.js.map