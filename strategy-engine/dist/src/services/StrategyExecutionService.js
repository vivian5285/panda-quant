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
exports.StrategyExecutionService = void 0;
const logger_1 = require("../utils/logger");
const CommissionService_1 = require("./CommissionService");
const StrategyMonitorService_1 = require("./StrategyMonitorService");
class StrategyExecutionService {
    constructor() {
        this.commissionService = CommissionService_1.CommissionService.getInstance();
        this.monitorService = StrategyMonitorService_1.StrategyMonitorService.getInstance();
    }
    static getInstance() {
        if (!StrategyExecutionService.instance) {
            StrategyExecutionService.instance = new StrategyExecutionService();
        }
        return StrategyExecutionService.instance;
    }
    executeStrategy(strategyId, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 执行策略逻辑
                const result = yield this.runStrategy(strategyId, parameters);
                // 如果有收益，处理佣金
                if (result.currentReturn && result.currentReturn > 0) {
                    yield this.commissionService.processTradeProfit(parameters.userId, strategyId, result.executionId, result.currentReturn);
                }
                // 更新监控数据
                this.monitorService.updatePerformance(strategyId, parameters.userId, {
                    currentReturn: result.currentReturn || 0,
                    maxDrawdown: result.maxDrawdown || 0,
                    dailyReturn: result.dailyReturn || 0,
                    totalTrades: result.totalTrades || 0,
                    winRate: result.winRate || 0
                });
                return result;
            }
            catch (error) {
                logger_1.logger.error('Strategy execution failed:', error);
                return {
                    executionId: this.generateExecutionId(),
                    status: 'failed',
                    message: error instanceof Error ? error.message : 'Unknown error',
                    trades: []
                };
            }
        });
    }
    runStrategy(strategyId, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: 实现具体的策略执行逻辑
            // 这里应该调用实际的交易API执行交易
            // 并返回交易结果
            return {
                executionId: this.generateExecutionId(),
                status: 'success',
                message: 'Strategy executed successfully',
                currentReturn: 100, // 示例数据
                maxDrawdown: 5,
                dailyReturn: 2,
                totalTrades: 10,
                winRate: 0.8,
                trades: []
            };
        });
    }
    generateExecutionId() {
        return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
exports.StrategyExecutionService = StrategyExecutionService;
