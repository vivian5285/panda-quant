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
const strategy_1 = require("../services/strategy");
const error_1 = require("../utils/error");
const StrategyExecutionService_1 = require("../services/StrategyExecutionService");
const BacktestService_1 = require("../services/BacktestService");
const RiskManagementService_1 = require("../services/RiskManagementService");
const PerformanceTracker_1 = require("../services/PerformanceTracker");
const StrategyEngine_1 = require("../engine/StrategyEngine");
const order_1 = require("../types/order");
describe('Strategy Execution', () => {
    const mockRequest = {
        strategyId: 'test-strategy',
        userId: 'test-user',
        parameters: {
            symbol: 'BTC/USDT',
            timeframe: '1h',
        },
    };
    it('should execute strategy successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, strategy_1.executeStrategy)(mockRequest);
        expect(result.status).toBe('completed');
        expect(result.executionId).toBeDefined();
        expect(result.result).toBeDefined();
    }));
    it('should handle invalid strategy ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidRequest = Object.assign(Object.assign({}, mockRequest), { strategyId: 'invalid-strategy' });
        yield expect((0, strategy_1.executeStrategy)(invalidRequest)).rejects.toThrow(error_1.StrategyError);
    }));
    it('should handle invalid parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidRequest = Object.assign(Object.assign({}, mockRequest), { parameters: {
                invalid: 'parameter',
            } });
        yield expect((0, strategy_1.executeStrategy)(invalidRequest)).rejects.toThrow(error_1.StrategyError);
    }));
});
describe('Strategy Tests', () => {
    let strategyEngine;
    let strategyService;
    let backtestService;
    let riskManagementService;
    let performanceTracker;
    beforeEach(() => {
        strategyEngine = new StrategyEngine_1.StrategyEngine();
        strategyService = StrategyExecutionService_1.StrategyExecutionService.getInstance();
        backtestService = BacktestService_1.BacktestService.getInstance();
        riskManagementService = new RiskManagementService_1.RiskManagementService();
        performanceTracker = new PerformanceTracker_1.PerformanceTracker();
    });
    describe('High Frequency Strategy', () => {
        test('should achieve monthly return > 50%', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield backtestService.runBacktest('high-frequency', {
                exchange: 'binance',
                symbol: 'BTC/USDT',
                timeframe: '1m',
                startTime: '2023-01-01',
                endTime: '2023-12-31',
                initialCapital: 10000
            });
            expect(result.monthlyReturn).toBeGreaterThan(0.5);
        }));
        test('should maintain drawdown < 10%', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield backtestService.runBacktest('high-frequency', {
                exchange: 'binance',
                symbol: 'BTC/USDT',
                timeframe: '1m',
                startTime: '2023-01-01',
                endTime: '2023-12-31',
                initialCapital: 10000
            });
            expect(result.maxDrawdown).toBeLessThan(0.1);
        }));
    });
    describe('Risk Management', () => {
        test('should approve valid strategy execution', () => __awaiter(void 0, void 0, void 0, function* () {
            const riskCheck = yield riskManagementService.checkRisk('user1', 10000);
            expect(riskCheck).toBe(true);
        }));
        test('should reject excessive leverage', () => __awaiter(void 0, void 0, void 0, function* () {
            const riskCheck = yield riskManagementService.checkRisk('user1', 100000);
            expect(riskCheck).toBe(false);
        }));
    });
    describe('Performance Tracking', () => {
        test('should record strategy performance', () => __awaiter(void 0, void 0, void 0, function* () {
            const performance = {
                monthlyReturn: 0.6,
                totalReturn: 1.2,
                maxDrawdown: 0.08,
                sharpeRatio: 2.5,
                trades: []
            };
            performanceTracker.recordPerformance('monthlyReturn', performance.monthlyReturn);
            performanceTracker.recordPerformance('maxDrawdown', performance.maxDrawdown);
            const recorded = performanceTracker.getPerformance();
            expect(recorded.monthlyReturn).toBe(0.6);
            expect(recorded.maxDrawdown).toBe(0.08);
        }));
    });
    describe('Strategy Execution', () => {
        test('should execute strategy successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const execution = yield strategyService.executeStrategy('high-frequency', {
                userId: 'user1',
                amount: 10000,
                exchange: 'binance'
            });
            expect(execution.status).toBe('success');
            expect(execution.trades).toBeDefined();
            expect(execution.trades.length).toBeGreaterThan(0);
        }));
        test('should handle execution errors', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(strategyService.executeStrategy('invalid-strategy', {
                userId: 'user1',
                amount: 10000,
                exchange: 'binance'
            })).rejects.toThrow();
        }));
    });
    it('should execute strategy successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const strategyId = 'test-strategy-1';
        const parameters = {
            userId: 'test-user-1',
            symbol: 'BTC/USDT',
            amount: 1000,
            leverage: 1,
            maxDrawdown: 0.1
        };
        const result = yield strategyEngine.executeStrategy(strategyId, parameters);
        expect(result).toBeDefined();
    }));
    it('should check risk properly', () => __awaiter(void 0, void 0, void 0, function* () {
        const isApproved = yield riskManagementService.checkRisk('user1', 1000);
        expect(isApproved).toBe(true);
    }));
    it('should track performance', () => __awaiter(void 0, void 0, void 0, function* () {
        performanceTracker.recordPerformance('profit', 100);
        const performance = performanceTracker.getPerformance();
        expect(performance.profit).toBe(100);
    }));
    it('should create order with correct type', () => __awaiter(void 0, void 0, void 0, function* () {
        const order = yield strategyEngine.createOrder({
            userId: 'user1',
            strategyId: '1',
            exchange: 'binance',
            symbol: 'BTC/USDT',
            type: order_1.OrderType.MARKET,
            side: order_1.OrderSide.BUY,
            amount: 1,
            retryCount: 0
        });
        expect(order.type).toBe(order_1.OrderType.MARKET);
    }));
});
