"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyService = void 0;
const mongoose_1 = require("mongoose");
const Strategy_1 = require("../models/Strategy");
const logger_1 = require("../utils/logger");
class StrategyService {
    constructor() { }
    static getInstance() {
        if (!StrategyService.instance) {
            StrategyService.instance = new StrategyService();
        }
        return StrategyService.instance;
    }
    async createStrategy(data) {
        try {
            const strategy = new Strategy_1.Strategy({
                ...data,
                userId: new mongoose_1.Types.ObjectId(data.userId),
                status: 'active'
            });
            await strategy.save();
            return strategy;
        }
        catch (error) {
            logger_1.logger.error('Error creating strategy:', error);
            throw error;
        }
    }
    async getStrategies(userId) {
        try {
            const strategies = await Strategy_1.Strategy.find({
                userId: new mongoose_1.Types.ObjectId(userId)
            }).sort({ createdAt: -1 });
            return strategies;
        }
        catch (error) {
            logger_1.logger.error('Error getting strategies:', error);
            throw error;
        }
    }
    async updateStrategy(id, data) {
        try {
            const strategy = await Strategy_1.Strategy.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true });
            return strategy;
        }
        catch (error) {
            logger_1.logger.error('Error updating strategy:', error);
            throw error;
        }
    }
}
exports.StrategyService = StrategyService;
//# sourceMappingURL=strategy.js.map