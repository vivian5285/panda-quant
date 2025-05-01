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
exports.StrategyAPIService = void 0;
const StrategyMonitorService_1 = require("./StrategyMonitorService");
const StrategyExecutionService_1 = require("./StrategyExecutionService");
const RiskManagementService_1 = require("./RiskManagementService");
const logger_1 = require("../utils/logger");
class StrategyAPIService {
    constructor() {
        this.monitorService = StrategyMonitorService_1.StrategyMonitorService.getInstance();
        this.executionService = StrategyExecutionService_1.StrategyExecutionService.getInstance();
        this.riskService = RiskManagementService_1.RiskManagementService.getInstance();
    }
    static getInstance() {
        if (!StrategyAPIService.instance) {
            StrategyAPIService.instance = new StrategyAPIService();
        }
        return StrategyAPIService.instance;
    }
    executeStrategy(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 检查风险
                if (!this.riskService.checkStrategyRisk(request.strategyId, request.parameters)) {
                    return {
                        executionId: '',
                        status: 'failed',
                        message: 'Strategy exceeds risk limits'
                    };
                }
                // 开始监控
                this.monitorService.startMonitoring(request.strategyId, request.userId);
                // 执行策略
                const result = yield this.executionService.executeStrategy(request.strategyId, request.parameters);
                // 更新性能指标
                this.monitorService.updatePerformance(request.strategyId, request.userId, {
                    status: 'running',
                    currentReturn: result.currentReturn || 0,
                    maxDrawdown: result.maxDrawdown || 0,
                    dailyReturn: result.dailyReturn || 0,
                    totalTrades: result.totalTrades || 0,
                    winRate: result.winRate || 0
                });
                return {
                    executionId: result.executionId,
                    status: 'success',
                    message: 'Strategy executed successfully',
                    performance: this.monitorService.getPerformance(request.strategyId, request.userId)
                };
            }
            catch (error) {
                logger_1.logger.error(`Error executing strategy: ${error}`);
                return {
                    executionId: '',
                    status: 'failed',
                    message: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        });
    }
    getStrategyPerformance(strategyId, userId) {
        return this.monitorService.getPerformance(strategyId, userId);
    }
    getAllStrategyPerformances(userId) {
        return this.monitorService.getAllPerformances(userId);
    }
    subscribeToStrategyUpdates(strategyId, userId, callback) {
        this.monitorService.subscribeToUpdates(strategyId, userId, callback);
    }
    unsubscribeFromStrategyUpdates(strategyId, userId) {
        this.monitorService.unsubscribeFromUpdates(strategyId, userId);
    }
}
exports.StrategyAPIService = StrategyAPIService;
