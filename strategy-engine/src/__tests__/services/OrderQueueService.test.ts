import { OrderQueueService } from '../../services/OrderQueueService';
import { OrderType, OrderSide, OrderStatus } from '../../types/order';

describe('OrderQueueService', () => {
  let orderQueueService: OrderQueueService;

  beforeEach(() => {
    orderQueueService = OrderQueueService.getInstance();
  });

  it('should add order to queue', async () => {
    const order = {
      userId: 'user1',
      strategyId: '1',
      exchange: 'binance',
      symbol: 'BTC/USDT',
      type: OrderType.MARKET,
      side: OrderSide.BUY,
      amount: 1,
      retryCount: 0
    };

    const result = await orderQueueService.addOrder(order);
    expect(result).toBeDefined();
  });

  it('should process order from queue', async () => {
    const order = {
      userId: 'user1',
      strategyId: '1',
      exchange: 'binance',
      symbol: 'BTC/USDT',
      type: OrderType.MARKET,
      side: OrderSide.BUY,
      amount: 1,
      retryCount: 0
    };

    const orderId = await orderQueueService.addOrder(order);
    await orderQueueService.processOrder(orderId);
    const status = orderQueueService.getOrderStatus(orderId);
    expect(status).toBe(OrderStatus.COMPLETED);
  });

  it('should handle order processing failure', async () => {
    const order = {
      userId: 'user1',
      strategyId: '1',
      exchange: 'binance',
      symbol: 'BTC/USDT',
      type: OrderType.MARKET,
      side: OrderSide.BUY,
      amount: 1,
      retryCount: 0
    };

    const orderId = await orderQueueService.addOrder(order);
    
    // 模拟订单执行失败
    jest.spyOn(orderQueueService as any, 'executeOrder').mockRejectedValueOnce(new Error('Network error'));
    
    await orderQueueService.processOrder(orderId);
    const status = orderQueueService.getOrderStatus(orderId);
    expect(status).toBe(OrderStatus.RETRYING);
  });
}); 