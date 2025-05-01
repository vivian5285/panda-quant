"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyService = void 0;
const Strategy_1 = require("../models/Strategy");
class StrategyService {
    constructor() { }
    static getInstance() {
        if (!StrategyService.instance) {
            StrategyService.instance = new StrategyService();
        }
        return StrategyService.instance;
    }
    async getStrategies() {
        return Strategy_1.Strategy.find();
    }
    async getStrategy(id) {
        return Strategy_1.Strategy.findById(id);
    }
    async createStrategy(data) {
        const strategy = new Strategy_1.Strategy(data);
        return strategy.save();
    }
    async updateStrategy(id, data) {
        return Strategy_1.Strategy.findByIdAndUpdate(id, data, { new: true });
    }
    async deleteStrategy(id) {
        await Strategy_1.Strategy.findByIdAndDelete(id);
    }
    async getAllStrategies() {
        return Strategy_1.Strategy.find();
    }
    async getStrategiesByUser(userId) {
        return Strategy_1.Strategy.find({ userId });
    }
    async getActiveStrategies() {
        return Strategy_1.Strategy.find({ status: 'active' });
    }
    async getPopularStrategies(limit = 10) {
        return Strategy_1.Strategy.find()
            .sort({ followers: -1 })
            .limit(limit);
    }
}
exports.StrategyService = StrategyService;
//# sourceMappingURL=%20strategyService.ts.Value.ToUpper()%20trategyService.js.map