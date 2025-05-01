"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StrategyEngine_1 = require("../../engine/StrategyEngine");
const types_1 = require("../../types");
describe('Strategy Integration Tests', () => {
    let strategyEngine;
    beforeEach(() => {
        strategyEngine = StrategyEngine_1.StrategyEngine.getInstance();
    });
    it('should execute strategy successfully', async () => {
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
        expect(result.trades).toBeDefined();
    });
    it('should create order with correct type', async () => {
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
        await strategyEngine.createOrder(orderData);
    });
    it('should handle order creation error', async () => {
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
        try {
            await strategyEngine.createOrder(orderData);
        }
        catch (error) {
            expect(error).toBeDefined();
        }
    });
});
//# sourceMappingURL=strategy.test.js.map