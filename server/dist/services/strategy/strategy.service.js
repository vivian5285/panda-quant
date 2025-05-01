"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyService = void 0;
const logger_1 = require("../../utils/logger");
const Strategy_1 = require("../../models/Strategy");
class StrategyService {
    constructor() {
        this.strategyModel = Strategy_1.Strategy;
    }
    static getInstance() {
        if (!StrategyService.instance) {
            StrategyService.instance = new StrategyService();
        }
        return StrategyService.instance;
    }
    async createStrategy(strategyData) {
        try {
            const strategy = new this.strategyModel(strategyData);
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
            const strategy = await this.strategyModel.findById(id);
            return strategy ? strategy.toObject() : null;
        }
        catch (error) {
            logger_1.logger.error('Error getting strategy by ID:', error);
            throw error;
        }
    }
    async updateStrategy(id, updates) {
        try {
            const strategy = await this.strategyModel.findByIdAndUpdate(id, updates, { new: true });
            return strategy ? strategy.toObject() : null;
        }
        catch (error) {
            logger_1.logger.error('Error updating strategy:', error);
            throw error;
        }
    }
    async deleteStrategy(id) {
        try {
            const result = await this.strategyModel.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            logger_1.logger.error('Error deleting strategy:', error);
            throw error;
        }
    }
    async getStrategiesByUserId(userId) {
        try {
            const strategies = await this.strategyModel.find({ userId });
            return strategies.map(strategy => strategy.toObject());
        }
        catch (error) {
            logger_1.logger.error('Error getting strategies by user ID:', error);
            throw error;
        }
    }
}
exports.StrategyService = StrategyService;
//# sourceMappingURL=strategy.service.js.map