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
exports.StrategyEngine = void 0;
const strategy_1 = require("../types/strategy");
const order_1 = require("../types/order");
const RiskManagementService_1 = require("../services/RiskManagementService");
const StrategyMonitorService_1 = require("../services/StrategyMonitorService");
const uuid_1 = require("uuid");
class StrategyEngine {
    constructor() {
        this.riskManagementService = RiskManagementService_1.RiskManagementService.getInstance();
        this.monitorService = StrategyMonitorService_1.StrategyMonitorService.getInstance();
    }
    executeStrategy(strategyId, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            // 检查风险
            if (!this.riskManagementService.checkStrategyRisk(strategyId, parameters)) {
                throw new Error('Strategy execution exceeds risk limits');
            }
            // 执行策略
            const executionId = (0, uuid_1.v4)();
            const status = strategy_1.StrategyStatus.RUNNING;
            // 更新监控
            this.monitorService.startMonitoring(strategyId, parameters.userId);
            this.monitorService.updatePerformance(strategyId, parameters.userId, {
                status,
                currentReturn: 0,
                maxDrawdown: 0,
                dailyReturn: 0,
                totalTrades: 0,
                winRate: 0
            });
            return { executionId, status };
        });
    }
    createOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            return Object.assign(Object.assign({}, order), { id: (0, uuid_1.v4)(), status: order_1.OrderStatus.PENDING, createdAt: new Date(), updatedAt: new Date() });
        });
    }
}
exports.StrategyEngine = StrategyEngine;
