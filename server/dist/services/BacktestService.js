"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BacktestService = void 0;
const mongoose_1 = require("mongoose");
const backtest_1 = require("../models/backtest");
const logger_1 = require("../utils/logger");
class BacktestService {
    async createBacktest(data) {
        try {
            const backtest = new backtest_1.Backtest(data);
            const savedBacktest = await backtest.save();
            const objectId = new mongoose_1.Types.ObjectId(savedBacktest._id.toString());
            return {
                ...savedBacktest.toObject(),
                _id: objectId,
                initialBalance: data.initialBalance,
                finalBalance: data.finalBalance,
                totalReturn: data.totalReturn,
                annualizedReturn: data.annualizedReturn,
                averageTrade: data.averageTrade
            };
        }
        catch (error) {
            logger_1.logger.error('Error creating backtest:', error);
            throw error;
        }
    }
    async getBacktestById(id) {
        try {
            const backtest = await backtest_1.Backtest.findById(id);
            if (!backtest)
                return null;
            const objectId = new mongoose_1.Types.ObjectId(backtest._id.toString());
            return {
                ...backtest.toObject(),
                _id: objectId,
                initialBalance: backtest.initialBalance || 0,
                finalBalance: backtest.finalBalance || 0,
                totalReturn: backtest.totalReturn || 0,
                annualizedReturn: backtest.annualizedReturn || 0,
                averageTrade: backtest.averageTrade || 0
            };
        }
        catch (error) {
            logger_1.logger.error('Error getting backtest:', error);
            throw error;
        }
    }
    async getBacktestsByStrategyId(strategyId) {
        try {
            const backtests = await backtest_1.Backtest.find({ strategyId });
            return backtests.map(backtest => {
                const objectId = new mongoose_1.Types.ObjectId(backtest._id.toString());
                return {
                    ...backtest.toObject(),
                    _id: objectId,
                    initialBalance: backtest.initialBalance || 0,
                    finalBalance: backtest.finalBalance || 0,
                    totalReturn: backtest.totalReturn || 0,
                    annualizedReturn: backtest.annualizedReturn || 0,
                    averageTrade: backtest.averageTrade || 0
                };
            });
        }
        catch (error) {
            logger_1.logger.error('Error getting backtests:', error);
            throw error;
        }
    }
    async updateBacktest(id, data) {
        try {
            const backtest = await backtest_1.Backtest.findByIdAndUpdate(id, data, { new: true });
            if (!backtest)
                return null;
            const objectId = new mongoose_1.Types.ObjectId(backtest._id.toString());
            return {
                ...backtest.toObject(),
                _id: objectId,
                initialBalance: backtest.initialBalance || 0,
                finalBalance: backtest.finalBalance || 0,
                totalReturn: backtest.totalReturn || 0,
                annualizedReturn: backtest.annualizedReturn || 0,
                averageTrade: backtest.averageTrade || 0
            };
        }
        catch (error) {
            logger_1.logger.error('Error updating backtest:', error);
            throw error;
        }
    }
    async deleteBacktest(id) {
        try {
            const result = await backtest_1.Backtest.findByIdAndDelete(id);
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