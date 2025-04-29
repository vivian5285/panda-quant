import { OrderQueueService } from '../../services/OrderQueueService';
import { OrderType, OrderStatus } from '../../types';
import { RedisService } from '../../services/redis';

describe('OrderQueueService', () => {
  let orderQueueService: OrderQueueService;
  let redisService: RedisService;

  beforeEach(() => {
    orderQueueService = OrderQueueService.getInstance();
    redisService = RedisService.getInstance();
  });

  afterEach(async () => {
    // 清理测试数据
    await redisService.del('order:queue');
    await redisService.del('order:failed');
  });

  it('should add order to queue', async () => {
    const order = {
      userId: 'test-user',
      strategyId: 'test-strategy',
      exchange: 'binance',
      symbol: 'BTC/USDT',
      type: OrderType.MARKET,
      side: 'buy' as const,
      amount: 1,
      retryCount: 0
    };

    await orderQueueService.addOrder(order);
    
    // 验证订单是否被添加到队列中
    const queueLength = await redisService.llen('order:queue');
    expect(queueLength).toBe(1);
    
    const orderStr = await redisService.lindex('order:queue', 0);
    const queuedOrder = JSON.parse(orderStr!);
    expect(queuedOrder.userId).toBe(order.userId);
    expect(queuedOrder.status).toBe(OrderStatus.PENDING);
  });

  it('should process orders in queue', async () => {
    const order = {
      userId: 'test-user',
      strategyId: 'test-strategy',
      exchange: 'binance',
      symbol: 'BTC/USDT',
      type: OrderType.MARKET,
      side: 'buy' as const,
      amount: 1,
      retryCount: 0
    };

    await orderQueueService.addOrder(order);
    await orderQueueService.processOrder();
    
    // 验证订单是否被处理
    const queueLength = await redisService.llen('order:queue');
    expect(queueLength).toBe(0);
  });

  it('should handle order processing errors', async () => {
    const invalidOrder = {
      userId: 'test-user',
      strategyId: 'test-strategy',
      exchange: 'invalid-exchange', // 使用无效的交易所
      symbol: 'BTC/USDT',
      type: OrderType.MARKET,
      side: 'buy' as const,
      amount: 1,
      retryCount: 0
    };

    await orderQueueService.addOrder(invalidOrder);
    await orderQueueService.processOrder();
    
    // 验证失败订单是否被移动到失败队列
    const failedQueueLength = await redisService.llen('order:failed');
    expect(failedQueueLength).toBe(1);
    
    const failedOrderStr = await redisService.lindex('order:failed', 0);
    const failedOrder = JSON.parse(failedOrderStr!);
    expect(failedOrder.status).toBe(OrderStatus.REJECTED);
  });
}); 