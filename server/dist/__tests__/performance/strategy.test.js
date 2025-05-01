"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StrategyEngine_1 = require("../../engine/StrategyEngine");
const types_1 = require("../../types");
describe('Strategy Performance Tests', () => {
    let strategyEngine;
    beforeEach(() => {
        strategyEngine = StrategyEngine_1.StrategyEngine.getInstance();
    });
    it('should execute strategy with good performance', async () => {
        const strategy = {
            id: 'test-strategy',
            userId: 'test-user',
            name: 'Test Strategy',
            description: 'Test Description',
            config: {},
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const result = await strategyEngine.executeStrategy(strategy);
        expect(result.status).toBe('success');
        expect(result.performance).toBeDefined();
    });
    it('should create order efficiently', async () => {
        const orderData = {
            userId: 'test-user',
            strategyId: 'test-strategy',
            exchange: 'binance',
            symbol: 'BTC/USDT',
            type: types_1.OrderType.MARKET,
            side: 'buy',
            amount: 1,
            retryCount: 0
        };
        const startTime = Date.now();
        await strategyEngine.createOrder(orderData);
        const endTime = Date.now();
        expect(endTime - startTime).toBeLessThan(1000);
    });
    it('should handle multiple orders efficiently', async () => {
        const orderData = {
            userId: 'test-user',
            strategyId: 'test-strategy',
            exchange: 'binance',
            symbol: 'BTC/USDT',
            type: types_1.OrderType.MARKET,
            side: 'buy',
            amount: 1,
            retryCount: 0
        };
        const startTime = Date.now();
        for (let i = 0; i < 10; i++) {
            await strategyEngine.createOrder(orderData);
        }
        const endTime = Date.now();
        expect(endTime - startTime).toBeLessThan(5000);
    });
});
//# sourceMappingURL=strategy.test.js.map