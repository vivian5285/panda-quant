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
const perf_hooks_1 = require("perf_hooks");
const order_1 = require("../../types/order");
const strategy_1 = require("../../types/strategy");
describe('Strategy Performance Tests', () => {
    let engine;
    let orderQueue;
    beforeEach(() => {
        engine = new StrategyEngine_1.StrategyEngine();
        orderQueue = OrderQueueService_1.OrderQueueService.getInstance();
    });
    describe('Strategy Execution Performance', () => {
        it('should handle multiple concurrent strategy executions', () => __awaiter(void 0, void 0, void 0, function* () {
            const numStrategies = 100;
            const strategies = Array.from({ length: numStrategies }, (_, i) => ({
                id: `strategy-${i}`,
                parameters: {
                    userId: `user-${i}`,
                    symbol: 'BTC/USDT',
                    amount: 1,
                    leverage: 5,
                    maxDrawdown: 0.05,
                },
            }));
            const startTime = perf_hooks_1.performance.now();
            // 并发执行策略
            const results = yield Promise.all(strategies.map(({ id, parameters }) => engine.executeStrategy(id, parameters)));
            const endTime = perf_hooks_1.performance.now();
            const duration = endTime - startTime;
            // 验证所有策略都执行成功
            expect(results.every(result => result.status === strategy_1.StrategyStatus.RUNNING)).toBe(true);
            // 验证执行时间在可接受范围内
            expect(duration).toBeLessThan(5000); // 5秒内完成
        }));
        it('should handle high-frequency order processing', () => __awaiter(void 0, void 0, void 0, function* () {
            const numOrders = 1000;
            const orders = Array.from({ length: numOrders }, (_, i) => ({
                userId: 'test-user',
                strategyId: 'test-strategy',
                exchange: 'binance',
                symbol: 'BTC/USDT',
                type: order_1.OrderType.MARKET,
                side: order_1.OrderSide.BUY,
                amount: 1,
                retryCount: 0,
            }));
            const startTime = perf_hooks_1.performance.now();
            // 并发添加订单
            const orderIds = yield Promise.all(orders.map(order => orderQueue.addOrder(order)));
            // 并发处理订单
            yield Promise.all(orderIds.map(orderId => orderQueue.processOrder(orderId)));
            const endTime = perf_hooks_1.performance.now();
            const duration = endTime - startTime;
            // 验证所有订单都处理完成
            const statuses = orderIds.map(orderId => orderQueue.getOrderStatus(orderId));
            expect(statuses.every(status => status === order_1.OrderStatus.COMPLETED)).toBe(true);
            // 验证处理时间在可接受范围内
            expect(duration).toBeLessThan(10000); // 10秒内完成
        }));
    });
    describe('Memory Usage', () => {
        it('should maintain stable memory usage under load', () => __awaiter(void 0, void 0, void 0, function* () {
            const initialMemory = process.memoryUsage().heapUsed;
            const numIterations = 1000;
            for (let i = 0; i < numIterations; i++) {
                yield engine.executeStrategy(`strategy-${i}`, {
                    userId: `user-${i}`,
                    symbol: 'BTC/USDT',
                    amount: 1,
                    leverage: 5,
                    maxDrawdown: 0.05,
                });
            }
            const finalMemory = process.memoryUsage().heapUsed;
            const memoryIncrease = finalMemory - initialMemory;
            // 验证内存增长在可接受范围内
            expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 小于50MB
        }));
    });
    describe('Response Time', () => {
        it('should maintain consistent response times', () => __awaiter(void 0, void 0, void 0, function* () {
            const numRequests = 100;
            const responseTimes = [];
            for (let i = 0; i < numRequests; i++) {
                const startTime = perf_hooks_1.performance.now();
                yield engine.executeStrategy(`strategy-${i}`, {
                    userId: `user-${i}`,
                    symbol: 'BTC/USDT',
                    amount: 1,
                    leverage: 5,
                    maxDrawdown: 0.05,
                });
                const endTime = perf_hooks_1.performance.now();
                responseTimes.push(endTime - startTime);
            }
            // 计算平均响应时间
            const avgResponseTime = responseTimes.reduce((a, b) => a + b) / numRequests;
            // 验证平均响应时间在可接受范围内
            expect(avgResponseTime).toBeLessThan(100); // 小于100ms
            // 验证响应时间标准差在可接受范围内
            const variance = responseTimes.reduce((a, b) => a + Math.pow(b - avgResponseTime, 2), 0) / numRequests;
            const stdDev = Math.sqrt(variance);
            expect(stdDev).toBeLessThan(50); // 标准差小于50ms
        }));
    });
});
