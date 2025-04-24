import { OrderQueueService } from '../../services/OrderQueueService';
import { Order, OrderStatus, OrderType, OrderSide } from '../../interfaces/order';

describe('OrderQueueService', () => {
  let service: OrderQueueService;

  beforeEach(() => {
    service = OrderQueueService.getInstance();
  });

  describe('addOrder', () => {
    it('should add a new order to the queue', async () => {
      const order: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'> = {
        userId: 'user1',
        strategyId: 'strategy1',
        exchange: 'binance',
        symbol: 'BTC/USDT',
        type: OrderType.MARKET,
        side: OrderSide.BUY,
        amount: 1,
      };

      const orderId = await service.addOrder(order);
      expect(orderId).toBeDefined();
      expect(service.getOrderStatus(orderId)).toBe(OrderStatus.PENDING);
    });
  });

  describe('processOrder', () => {
    it('should process an order successfully', async () => {
      const order: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'> = {
        userId: 'user1',
        strategyId: 'strategy1',
        exchange: 'binance',
        symbol: 'BTC/USDT',
        type: OrderType.MARKET,
        side: OrderSide.BUY,
        amount: 1,
      };

      const orderId = await service.addOrder(order);
      await service.processOrder(orderId);
      expect(service.getOrderStatus(orderId)).toBe(OrderStatus.COMPLETED);
    });

    it('should retry failed orders', async () => {
      const order: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'> = {
        userId: 'user1',
        strategyId: 'strategy1',
        exchange: 'binance',
        symbol: 'BTC/USDT',
        type: OrderType.MARKET,
        side: OrderSide.BUY,
        amount: 1,
      };

      const orderId = await service.addOrder(order);
      
      // 模拟订单执行失败
      jest.spyOn(service as any, 'executeOrder').mockRejectedValueOnce(new Error('Network error'));
      
      await service.processOrder(orderId);
      expect(service.getOrderStatus(orderId)).toBe(OrderStatus.RETRYING);
    });
  });

  describe('cancelOrder', () => {
    it('should cancel a pending order', async () => {
      const order: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'> = {
        userId: 'user1',
        strategyId: 'strategy1',
        exchange: 'binance',
        symbol: 'BTC/USDT',
        type: OrderType.MARKET,
        side: OrderSide.BUY,
        amount: 1,
      };

      const orderId = await service.addOrder(order);
      const result = await service.cancelOrder(orderId);
      expect(result).toBe(true);
      expect(service.getOrderStatus(orderId)).toBe(OrderStatus.CANCELLED);
    });

    it('should not cancel a completed order', async () => {
      const order: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'> = {
        userId: 'user1',
        strategyId: 'strategy1',
        exchange: 'binance',
        symbol: 'BTC/USDT',
        type: OrderType.MARKET,
        side: OrderSide.BUY,
        amount: 1,
      };

      const orderId = await service.addOrder(order);
      await service.processOrder(orderId);
      const result = await service.cancelOrder(orderId);
      expect(result).toBe(false);
      expect(service.getOrderStatus(orderId)).toBe(OrderStatus.COMPLETED);
    });
  });
}); 