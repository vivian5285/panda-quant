"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BacktestService = void 0;
const Backtest_1 = require("../models/Backtest");
const logger_1 = require("../utils/logger");
class BacktestService {
    async createBacktest(data) {
        try {
            const backtest = new Backtest_1.Backtest(data);
            const savedBacktest = await backtest.save();
            return savedBacktest.toObject();
        }
        catch (error) {
            logger_1.logger.error('Error creating backtest:', error);
            throw error;
        }
    }
    async getBacktestById(id) {
        try {
            const backtest = await Backtest_1.Backtest.findById(id);
            if (!backtest)
                return null;
            return backtest.toObject();
        }
        catch (error) {
            logger_1.logger.error('Error getting backtest:', error);
            throw error;
        }
    }
    async getBacktestsByStrategyId(strategyId) {
        try {
            const backtests = await Backtest_1.Backtest.find({ strategyId });
            return backtests.map(backtest => backtest.toObject());
        }
        catch (error) {
            logger_1.logger.error('Error getting backtests:', error);
            throw error;
        }
    }
    async updateBacktest(id, data) {
        try {
            const backtest = await Backtest_1.Backtest.findByIdAndUpdate(id, data, { new: true });
            if (!backtest)
                return null;
            return backtest.toObject();
        }
        catch (error) {
            logger_1.logger.error('Error updating backtest:', error);
            throw error;
        }
    }
    async deleteBacktest(id) {
        try {
            const result = await Backtest_1.Backtest.findByIdAndDelete(id);
            return result !== null;
        }
        catch (error) {
            logger_1.logger.error('Error deleting backtest:', error);
            throw error;
        }
    }
}
exports.BacktestService = BacktestService;
//# sourceMappingURL=BacktestService.js.map