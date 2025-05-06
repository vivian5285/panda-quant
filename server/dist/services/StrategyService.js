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
exports.StrategyService = exports.StrategyStatus = void 0;
const Strategy_1 = require("../models/Strategy");
const logger_1 = require("../utils/logger");
var StrategyStatus;
(function (StrategyStatus) {
    StrategyStatus["ACTIVE"] = "active";
    StrategyStatus["INACTIVE"] = "inactive";
    StrategyStatus["PAUSED"] = "paused";
})(StrategyStatus || (exports.StrategyStatus = StrategyStatus = {}));
class StrategyService {
    constructor() { }
    static getInstance() {
        if (!StrategyService.instance) {
            StrategyService.instance = new StrategyService();
        }
        return StrategyService.instance;
    }
    createStrategy(strategy) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newStrategy = new Strategy_1.Strategy(strategy);
                return yield newStrategy.save();
            }
            catch (error) {
                logger_1.logger.error('Error creating strategy:', error);
                throw error;
            }
        });
    }
    getStrategies(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Strategy_1.Strategy.find({ userId });
            }
            catch (error) {
                logger_1.logger.error('Error getting strategies:', error);
                throw error;
            }
        });
    }
    getStrategy(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Strategy_1.Strategy.findById(id);
            }
            catch (error) {
                logger_1.logger.error('Error getting strategy:', error);
                throw error;
            }
        });
    }
    updateStrategy(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Strategy_1.Strategy.findByIdAndUpdate(id, updates, { new: true });
            }
            catch (error) {
                logger_1.logger.error('Error updating strategy:', error);
                throw error;
            }
        });
    }
    deleteStrategy(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Strategy_1.Strategy.findByIdAndUpdate(id, { status: StrategyStatus.INACTIVE }, { new: true });
            }
            catch (error) {
                logger_1.logger.error('Error deleting strategy:', error);
                throw error;
            }
        });
    }
    getStrategyPerformance(strategyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const strategy = yield this.getStrategy(strategyId);
                if (!strategy) {
                    throw new Error('Strategy not found');
                }
                // TODO: 实现实际的性能计算逻辑
                return {
                    totalProfit: 0,
                    winRate: 0,
                    trades: []
                };
            }
            catch (error) {
                logger_1.logger.error('Error getting strategy performance:', error);
                throw error;
            }
        });
    }
    getAllStrategies() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Strategy_1.Strategy.find();
            }
            catch (error) {
                logger_1.logger.error('Error getting all strategies:', error);
                throw error;
            }
        });
    }
    getStrategiesByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Strategy_1.Strategy.find({ userId });
            }
            catch (error) {
                logger_1.logger.error('Error getting strategies by user:', error);
                throw error;
            }
        });
    }
    getActiveStrategies() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Strategy_1.Strategy.find({ status: StrategyStatus.ACTIVE });
            }
            catch (error) {
                logger_1.logger.error('Error getting active strategies:', error);
                throw error;
            }
        });
    }
    getPopularStrategies(limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Strategy_1.Strategy.find()
                    .sort({ followers: -1 })
                    .limit(limit);
            }
            catch (error) {
                logger_1.logger.error('Error getting popular strategies:', error);
                throw error;
            }
        });
    }
}
exports.StrategyService = StrategyService;
//# sourceMappingURL=StrategyService.js.map