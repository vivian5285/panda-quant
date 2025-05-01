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
const StrategyEngine_1 = require("../../engine/StrategyEngine");
const OrderQueueService_1 = require("../../services/OrderQueueService");
const RiskManagementService_1 = require("../../services/RiskManagementService");
const StrategyMonitorService_1 = require("../../services/StrategyMonitorService");
const order_1 = require("../../types/order");
const strategy_1 = require("../../types/strategy");
describe('Strategy Integration Tests', () => {
    let engine;
    let orderQueue;
    let riskManager;
    let monitor;
    beforeEach(() => {
        engine = new StrategyEngine_1.StrategyEngine();
        orderQueue = OrderQueueService_1.OrderQueueService.getInstance();
        riskManager = RiskManagementService_1.RiskManagementService.getInstance();
        monitor = StrategyMonitorService_1.StrategyMonitorService.getInstance();
    });
    describe('Strategy Execution Flow', () => {
        it('should execute a strategy with proper risk checks', () => __awaiter(void 0, void 0, void 0, function* () {
            const strategyId = 'test-strategy';
            const userId = 'test-user';
            const parameters = {
                userId,
                symbol: 'BTC/USDT',
                amount: 1,
                leverage: 5,
                maxDrawdown: 0.05,
            };
            // 开始监控
            monitor.startMonitoring(strategyId, userId);
            // 执行策略
            const result = yield engine.executeStrategy(strategyId, parameters);
            // 验证风险检查
            expect(riskManager.checkStrategyRisk(strategyId, parameters)).toBe(true);
            // 验证订单队列
            const orderStatus = orderQueue.getOrderStatus(result.executionId);
            expect(orderStatus).toBeDefined();
            // 验证监控
            const performance = monitor.getPerformance(strategyId, userId);
            expect(performance).toBeDefined();
            expect(result.status).toBe(strategy_1.StrategyStatus.RUNNING);
        }));
        it('should handle strategy execution failure', () => __awaiter(void 0, void 0, void 0, function* () {
            const strategyId = 'test-strategy';
            const userId = 'test-user';
            const parameters = {
                userId,
                symbol: 'BTC/USDT',
                amount: 1000, // 超出风险限制
                leverage: 50, // 超出风险限制
                maxDrawdown: 0.5, // 超出风险限制
            };
            // 开始监控
            monitor.startMonitoring(strategyId, userId);
            // 验证风险检查失败
            expect(riskManager.checkStrategyRisk(strategyId, parameters)).toBe(false);
            // 尝试执行策略
            try {
                yield engine.executeStrategy(strategyId, parameters);
                fail('Should have thrown an error');
            }
            catch (error) {
                expect(error.message).toContain('exceeds risk limits');
            }
        }));
    });
    describe('Order Processing Flow', () => {
        it('should process orders with retry mechanism', () => __awaiter(void 0, void 0, void 0, function* () {
            const order = {
                userId: 'test-user',
                strategyId: 'test-strategy',
                exchange: 'binance',
                symbol: 'BTC/USDT',
                type: order_1.OrderType.MARKET,
                side: order_1.OrderSide.BUY,
                amount: 1,
                retryCount: 0,
            };
            // 添加订单
            const orderId = yield orderQueue.addOrder(order);
            // 模拟订单执行失败
            jest.spyOn(orderQueue, 'executeOrder').mockRejectedValueOnce(new Error('Network error'));
            // 处理订单
            yield orderQueue.processOrder(orderId);
            // 验证重试状态
            const status = orderQueue.getOrderStatus(orderId);
            expect(status).toBe(order_1.OrderStatus.RETRYING);
        }));
    });
    describe('Monitoring and Metrics', () => {
        it('should track strategy performance metrics', () => __awaiter(void 0, void 0, void 0, function* () {
            const strategyId = 'test-strategy';
            const userId = 'test-user';
            // 开始监控
            monitor.startMonitoring(strategyId, userId);
            // 更新性能指标
            monitor.updatePerformance(strategyId, userId, {
                status: strategy_1.StrategyStatus.RUNNING,
                currentReturn: 0.05,
                maxDrawdown: 0.02,
                dailyReturn: 0.01,
                totalTrades: 10,
                winRate: 0.8,
            });
            // 获取性能数据
            const performance = monitor.getPerformance(strategyId, userId);
            expect(performance).toEqual({
                strategyId,
                userId,
                status: strategy_1.StrategyStatus.RUNNING,
                startTime: expect.any(Date),
                currentReturn: 0.05,
                maxDrawdown: 0.02,
                dailyReturn: 0.01,
                totalTrades: 10,
                winRate: 0.8,
                lastUpdate: expect.any(Date)
            });
        }));
    });
});
