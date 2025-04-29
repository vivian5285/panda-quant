import { StrategyEngine } from '../../engine/StrategyEngine';
import { OrderType, OrderStatus } from '../../types';

describe('Strategy Integration Tests', () => {
  let strategyEngine: StrategyEngine;

  beforeEach(() => {
    strategyEngine = StrategyEngine.getInstance();
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
      type: OrderType.MARKET,
      side: 'buy' as const,
      amount: 1,
      retryCount: 0
    };

    await strategyEngine.createOrder(orderData);
    // Add assertions here
  });

  it('should handle order creation error', async () => {
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

    try {
      await strategyEngine.createOrder(orderData);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
}); 