"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BacktestService = void 0;
const Backtest_1 = require("../models/Backtest");
const logger_1 = require("../utils/logger");
class BacktestService {
    createBacktest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const backtest = new Backtest_1.Backtest(data);
                const savedBacktest = yield backtest.save();
                return savedBacktest.toObject();
            }
            catch (error) {
                logger_1.logger.error('Error creating backtest:', error);
                throw error;
            }
        });
    }
    getBacktestById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const backtest = yield Backtest_1.Backtest.findById(id);
                if (!backtest)
                    return null;
                return backtest.toObject();
            }
            catch (error) {
                logger_1.logger.error('Error getting backtest:', error);
                throw error;
            }
        });
    }
    getBacktestsByStrategyId(strategyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const backtests = yield Backtest_1.Backtest.find({ strategyId });
                return backtests.map(backtest => backtest.toObject());
            }
            catch (error) {
                logger_1.logger.error('Error getting backtests:', error);
                throw error;
            }
        });
    }
    updateBacktest(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const backtest = yield Backtest_1.Backtest.findByIdAndUpdate(id, data, { new: true });
                if (!backtest)
                    return null;
                return backtest.toObject();
            }
            catch (error) {
                logger_1.logger.error('Error updating backtest:', error);
                throw error;
            }
        });
    }
    deleteBacktest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield Backtest_1.Backtest.findByIdAndDelete(id);
                return result !== null;
            }
            catch (error) {
                logger_1.logger.error('Error deleting backtest:', error);
                throw error;
            }
        });
    }
}
exports.BacktestService = BacktestService;
//# sourceMappingURL=BacktestService.js.map