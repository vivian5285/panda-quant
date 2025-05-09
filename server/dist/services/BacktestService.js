"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BacktestService = void 0;
const mongoose_1 = require("mongoose");
const backtest_model_1 = require("../models/backtest.model");
const logger_1 = require("../utils/logger");
const AppError_1 = require("../utils/AppError");
class BacktestService {
    constructor() { }
    static getInstance() {
        if (!BacktestService.instance) {
            BacktestService.instance = new BacktestService();
        }
        return BacktestService.instance;
    }
    convertToIBacktest(doc) {
        const obj = doc.toObject();
        return {
            _id: obj._id,
            userId: obj.userId,
            strategyId: obj.strategyId,
            name: obj.name,
            description: obj.description,
            period: obj.period,
            parameters: obj.parameters,
            results: obj.results,
            status: obj.status,
            error: obj.error,
            metadata: obj.metadata,
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt
        };
    }
    async createBacktest(backtestData) {
        try {
            const backtest = new backtest_model_1.Backtest(backtestData);
            const savedBacktest = await backtest.save();
            return this.convertToIBacktest(savedBacktest);
        }
        catch (error) {
            logger_1.logger.error('Error creating backtest:', error);
            throw new AppError_1.AppError('Failed to create backtest', 500);
        }
    }
    async getBacktestById(id) {
        try {
            const backtest = await backtest_model_1.Backtest.findById(id);
            if (!backtest)
                return null;
            return this.convertToIBacktest(backtest);
        }
        catch (error) {
            logger_1.logger.error('Error getting backtest:', error);
            throw new AppError_1.AppError('Failed to get backtest', 500);
        }
    }
    async getBacktestsByUserId(userId) {
        try {
            const backtests = await backtest_model_1.Backtest.find({ userId: new mongoose_1.Types.ObjectId(userId) });
            return backtests.map(backtest => this.convertToIBacktest(backtest));
        }
        catch (error) {
            logger_1.logger.error('Error getting backtests:', error);
            throw new AppError_1.AppError('Failed to get backtests', 500);
        }
    }
    async getBacktestByStrategyId(strategyId) {
        try {
            const backtest = await backtest_model_1.Backtest.findOne({ strategyId: new mongoose_1.Types.ObjectId(strategyId) });
            if (!backtest)
                return null;
            return this.convertToIBacktest(backtest);
        }
        catch (error) {
            logger_1.logger.error('Error getting backtest:', error);
            throw new AppError_1.AppError('Failed to get backtest', 500);
        }
    }
}
exports.BacktestService = BacktestService;
//# sourceMappingURL=BacktestService.js.map