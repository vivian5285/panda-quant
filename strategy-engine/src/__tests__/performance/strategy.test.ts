import { StrategyEngine } from '../../engine/StrategyEngine';
import { OrderQueueService } from '../../services/OrderQueueService';
import { performance } from 'perf_hooks';

describe('Strategy Performance Tests', () => {
  let engine: StrategyEngine;
  let orderQueue: OrderQueueService;

  beforeEach(() => {
    engine = new StrategyEngine();
    orderQueue = OrderQueueService.getInstance();
  });

  describe('Strategy Execution Performance', () => {
    it('should handle multiple concurrent strategy executions', async () => {
      const numStrategies = 100;
      const strategies = Array.from({ length: numStrategies }, (_, i) => ({
        id: `strategy-${i}`,
        parameters: {
          symbol: 'BTC/USDT',
          amount: 1,
          leverage: 5,
          maxDrawdown: 0.05,
        },
      }));

      const startTime = performance.now();

      // 并发执行策略
      const results = await Promise.all(
        strategies.map(({ id, parameters }) =>
          engine.executeStrategy(id, parameters)
        )
      );

      const endTime = performance.now();
      const duration = endTime - startTime;

      // 验证所有策略都执行成功
      expect(results.every(result => result.status === 'success')).toBe(true);

      // 验证执行时间在可接受范围内
      expect(duration).toBeLessThan(5000); // 5秒内完成
    });

    it('should handle high-frequency order processing', async () => {
      const numOrders = 1000;
      const orders = Array.from({ length: numOrders }, (_, i) => ({
        userId: 'test-user',
        strategyId: 'test-strategy',
        exchange: 'binance',
        symbol: 'BTC/USDT',
        type: 'market',
        side: 'buy',
        amount: 1,
        retryCount: 0,
      }));

      const startTime = performance.now();

      // 并发添加订单
      const orderIds = await Promise.all(
        orders.map(order => orderQueue.addOrder(order))
      );

      // 并发处理订单
      await Promise.all(
        orderIds.map(orderId => orderQueue.processOrder(orderId))
      );

      const endTime = performance.now();
      const duration = endTime - startTime;

      // 验证所有订单都处理完成
      const statuses = orderIds.map(orderId => orderQueue.getOrderStatus(orderId));
      expect(statuses.every(status => status === 'completed')).toBe(true);

      // 验证处理时间在可接受范围内
      expect(duration).toBeLessThan(10000); // 10秒内完成
    });
  });

  describe('Memory Usage', () => {
    it('should maintain stable memory usage under load', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      const numIterations = 1000;

      for (let i = 0; i < numIterations; i++) {
        await engine.executeStrategy(`strategy-${i}`, {
          symbol: 'BTC/USDT',
          amount: 1,
          leverage: 5,
          maxDrawdown: 0.05,
        });
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // 验证内存增长在可接受范围内
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 小于50MB
    });
  });

  describe('Response Time', () => {
    it('should maintain consistent response times', async () => {
      const numRequests = 100;
      const responseTimes: number[] = [];

      for (let i = 0; i < numRequests; i++) {
        const startTime = performance.now();
        await engine.executeStrategy(`strategy-${i}`, {
          symbol: 'BTC/USDT',
          amount: 1,
          leverage: 5,
          maxDrawdown: 0.05,
        });
        const endTime = performance.now();
        responseTimes.push(endTime - startTime);
      }

      // 计算平均响应时间
      const avgResponseTime = responseTimes.reduce((a, b) => a + b) / numRequests;

      // 验证平均响应时间在可接受范围内
      expect(avgResponseTime).toBeLessThan(100); // 小于100ms

      // 验证响应时间标准差在可接受范围内
      const variance = responseTimes.reduce((a, b) => a + Math.pow(b - avgResponseTime, 2), 0) / numRequests;
      const stdDev = Math.sqrt(variance);
      expect(stdDev).toBeLessThan(50); // 标准差小于50ms
    });
  });
}); 