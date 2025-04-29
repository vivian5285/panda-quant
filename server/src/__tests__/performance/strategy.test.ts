import { StrategyEngine } from '../../engine/StrategyEngine';
import { OrderType } from '../../types';

describe('Strategy Performance Tests', () => {
  let strategyEngine: StrategyEngine;

  beforeEach(() => {
    strategyEngine = StrategyEngine.getInstance();
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
      type: OrderType.MARKET,
      side: 'buy' as const,
      amount: 1,
      retryCount: 0
    };

    const startTime = Date.now();
    await strategyEngine.createOrder(orderData);
    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
  });

  it('should handle multiple orders efficiently', async () => {
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

    const startTime = Date.now();
    for (let i = 0; i < 10; i++) {
      await strategyEngine.createOrder(orderData);
    }
    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
  });
}); 