import { OrderQueueService } from '../../services/OrderQueueService';
import { OrderType, OrderSide } from '../../types/order';

describe('OrderQueueService', () => {
  let orderQueueService: OrderQueueService;

  beforeEach(() => {
    orderQueueService = new OrderQueueService();
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

    await orderQueueService.addOrder(order);
    const processedOrder = await orderQueueService.processNextOrder();
    expect(processedOrder).toBeDefined();
  });

  it('should retry failed order', async () => {
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

    await orderQueueService.addOrder(order);
    const result = await orderQueueService.retryFailedOrder(order);
    expect(result).toBeDefined();
  });
}); 