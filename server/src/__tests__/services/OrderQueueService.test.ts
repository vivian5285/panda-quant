import { OrderQueueService } from '../../services/OrderQueueService';
import { OrderType } from '../../types';

describe('OrderQueueService', () => {
  let orderQueueService: OrderQueueService;

  beforeEach(() => {
    orderQueueService = OrderQueueService.getInstance();
  });

  it('should add order to queue', async () => {
    const orderData = {
      userId: 'test-user',
      strategyId: 'test-strategy',
      exchange: 'binance',
      symbol: 'BTC/USDT',
      type: OrderType.MARKET,
      side: 'buy' as const,
      amount: 1,
      retryCount: 0
    };

    await orderQueueService.addOrder(orderData);
    // Add assertions here
  });

  it('should process order from queue', async () => {
    await orderQueueService.processOrder();
    // Add assertions here
  });
}); 