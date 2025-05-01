"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OrderQueueService_1 = require("../../services/OrderQueueService");
const types_1 = require("../../types");
const redis_1 = require("../../services/redis");
describe('OrderQueueService', () => {
    let orderQueueService;
    let redisService;
    beforeEach(() => {
        orderQueueService = OrderQueueService_1.OrderQueueService.getInstance();
        redisService = redis_1.RedisService.getInstance();
    });
    afterEach(async () => {
        await redisService.del('order:queue');
        await redisService.del('order:failed');
    });
    it('should add order to queue', async () => {
        const order = {
            userId: 'test-user',
            strategyId: 'test-strategy',
            exchange: 'binance',
            symbol: 'BTC/USDT',
            type: types_1.OrderType.MARKET,
            side: 'buy',
            amount: 1,
            retryCount: 0
        };
        await orderQueueService.addOrder(order);
        const queueLength = await redisService.llen('order:queue');
        expect(queueLength).toBe(1);
        const orderStr = await redisService.lindex('order:queue', 0);
        const queuedOrder = JSON.parse(orderStr);
        expect(queuedOrder.userId).toBe(order.userId);
        expect(queuedOrder.status).toBe(types_1.OrderStatus.PENDING);
    });
    it('should process orders in queue', async () => {
        const order = {
            userId: 'test-user',
            strategyId: 'test-strategy',
            exchange: 'binance',
            symbol: 'BTC/USDT',
            type: types_1.OrderType.MARKET,
            side: 'buy',
            amount: 1,
            retryCount: 0
        };
        await orderQueueService.addOrder(order);
        await orderQueueService.processOrder();
        const queueLength = await redisService.llen('order:queue');
        expect(queueLength).toBe(0);
    });
    it('should handle order processing errors', async () => {
        const invalidOrder = {
            userId: 'test-user',
            strategyId: 'test-strategy',
            exchange: 'invalid-exchange',
            symbol: 'BTC/USDT',
            type: types_1.OrderType.MARKET,
            side: 'buy',
            amount: 1,
            retryCount: 0
        };
        await orderQueueService.addOrder(invalidOrder);
        await orderQueueService.processOrder();
        const failedQueueLength = await redisService.llen('order:failed');
        expect(failedQueueLength).toBe(1);
        const failedOrderStr = await redisService.lindex('order:failed', 0);
        const failedOrder = JSON.parse(failedOrderStr);
        expect(failedOrder.status).toBe(types_1.OrderStatus.REJECTED);
    });
});
//# sourceMappingURL=OrderQueueService.test.js.map