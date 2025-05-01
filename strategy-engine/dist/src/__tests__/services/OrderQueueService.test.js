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
const OrderQueueService_1 = require("../../services/OrderQueueService");
const order_1 = require("../../types/order");
describe('OrderQueueService', () => {
    let orderQueueService;
    beforeEach(() => {
        orderQueueService = OrderQueueService_1.OrderQueueService.getInstance();
    });
    it('should add order to queue', () => __awaiter(void 0, void 0, void 0, function* () {
        const order = {
            userId: 'user1',
            strategyId: '1',
            exchange: 'binance',
            symbol: 'BTC/USDT',
            type: order_1.OrderType.MARKET,
            side: order_1.OrderSide.BUY,
            amount: 1,
            retryCount: 0
        };
        const result = yield orderQueueService.addOrder(order);
        expect(result).toBeDefined();
    }));
    it('should process order from queue', () => __awaiter(void 0, void 0, void 0, function* () {
        const order = {
            userId: 'user1',
            strategyId: '1',
            exchange: 'binance',
            symbol: 'BTC/USDT',
            type: order_1.OrderType.MARKET,
            side: order_1.OrderSide.BUY,
            amount: 1,
            retryCount: 0
        };
        const orderId = yield orderQueueService.addOrder(order);
        yield orderQueueService.processOrder(orderId);
        const status = orderQueueService.getOrderStatus(orderId);
        expect(status).toBe(order_1.OrderStatus.COMPLETED);
    }));
    it('should handle order processing failure', () => __awaiter(void 0, void 0, void 0, function* () {
        const order = {
            userId: 'user1',
            strategyId: '1',
            exchange: 'binance',
            symbol: 'BTC/USDT',
            type: order_1.OrderType.MARKET,
            side: order_1.OrderSide.BUY,
            amount: 1,
            retryCount: 0
        };
        const orderId = yield orderQueueService.addOrder(order);
        // 模拟订单执行失败
        jest.spyOn(orderQueueService, 'executeOrder').mockRejectedValueOnce(new Error('Network error'));
        yield orderQueueService.processOrder(orderId);
        const status = orderQueueService.getOrderStatus(orderId);
        expect(status).toBe(order_1.OrderStatus.RETRYING);
    }));
});
