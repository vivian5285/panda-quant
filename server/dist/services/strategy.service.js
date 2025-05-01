"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyService = void 0;
const mongoose_1 = require("mongoose");
const strategy_model_1 = require("../models/strategy.model");
const AppError_1 = require("../utils/AppError");
class StrategyService {
    constructor() {
        this.strategyModel = strategy_model_1.Strategy;
    }
    async getStrategies(userId) {
        return this.strategyModel.find({ userId });
    }
    async getStrategy(id, userId) {
        return this.strategyModel.findOne({ _id: id, userId });
    }
    async createStrategy(userId, data) {
        const strategy = new this.strategyModel({
            ...data,
            userId
        });
        return strategy.save();
    }
    async updateStrategy(id, userId, data) {
        return this.strategyModel.findOneAndUpdate({ _id: id, userId }, { $set: data }, { new: true });
    }
    async deleteStrategy(id, userId) {
        return this.strategyModel.findOneAndDelete({ _id: id, userId });
    }
    async getStrategiesByStatus(userId, status) {
        return this.strategyModel.find({
            userId: new mongoose_1.Types.ObjectId(userId),
            status
        });
    }
    async getStrategiesByType(userId, type) {
        return this.strategyModel.find({
            userId: new mongoose_1.Types.ObjectId(userId),
            type
        });
    }
    async getStrategySummary(userId) {
        const strategies = await this.strategyModel.find({ userId: new mongoose_1.Types.ObjectId(userId) });
        return {
            totalStrategies: strategies.length,
            activeStrategies: strategies.filter(s => s.status === 'active').length,
            totalProfit: strategies.reduce((sum, s) => { var _a; return sum + (((_a = s.performance) === null || _a === void 0 ? void 0 : _a.profit) || 0); }, 0)
        };
    }
    async getStrategyPerformance(id, userId) {
        const strategy = await this.strategyModel.findOne({ _id: id, userId });
        if (!strategy) {
            throw new AppError_1.AppError('Strategy not found', 404);
        }
        // TODO: Implement performance calculation
        return {
            strategyId: id,
            performance: 0,
            metrics: {}
        };
    }
}
exports.StrategyService = StrategyService;
//# sourceMappingURL=strategy.service.js.map