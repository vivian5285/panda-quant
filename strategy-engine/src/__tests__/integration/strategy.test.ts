import { StrategyEngine } from '../../engine/StrategyEngine';
import { OrderQueueService } from '../../services/OrderQueueService';
import { RiskManagementService } from '../../services/RiskManagementService';
import { StrategyMonitorService } from '../../services/StrategyMonitorService';
import { OrderType, OrderSide, OrderStatus } from '../../types/order';
import { StrategyStatus } from '../../types/strategy';

describe('Strategy Integration Tests', () => {
  let engine: StrategyEngine;
  let orderQueue: OrderQueueService;
  let riskManager: RiskManagementService;
  let monitor: StrategyMonitorService;

  beforeEach(() => {
    engine = new StrategyEngine();
    orderQueue = OrderQueueService.getInstance();
    riskManager = RiskManagementService.getInstance();
    monitor = StrategyMonitorService.getInstance();
  });

  describe('Strategy Execution Flow', () => {
    it('should execute a strategy with proper risk checks', async () => {
      const strategyId = 'test-strategy';
      const userId = 'test-user';
      const parameters = {
        userId,
        symbol: 'BTC/USDT',
        amount: 1,
        leverage: 5,
        maxDrawdown: 0.05,
      };

      // 开始监控
      monitor.startMonitoring(strategyId, userId);

      // 执行策略
      const result = await engine.executeStrategy(strategyId, parameters);

      // 验证风险检查
      expect(riskManager.checkStrategyRisk(strategyId, parameters)).toBe(true);

      // 验证订单队列
      const orderStatus = orderQueue.getOrderStatus(result.executionId);
      expect(orderStatus).toBeDefined();

      // 验证监控
      const performance = monitor.getPerformance(strategyId, userId);
      expect(performance).toBeDefined();
      expect(result.status).toBe(StrategyStatus.RUNNING);
    });

    it('should handle strategy execution failure', async () => {
      const strategyId = 'test-strategy';
      const userId = 'test-user';
      const parameters = {
        userId,
        symbol: 'BTC/USDT',
        amount: 1000, // 超出风险限制
        leverage: 50, // 超出风险限制
        maxDrawdown: 0.5, // 超出风险限制
      };

      // 开始监控
      monitor.startMonitoring(strategyId, userId);

      // 验证风险检查失败
      expect(riskManager.checkStrategyRisk(strategyId, parameters)).toBe(false);

      // 尝试执行策略
      try {
        await engine.executeStrategy(strategyId, parameters);
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('exceeds risk limits');
      }
    });
  });

  describe('Order Processing Flow', () => {
    it('should process orders with retry mechanism', async () => {
      const order = {
        userId: 'test-user',
        strategyId: 'test-strategy',
        exchange: 'binance',
        symbol: 'BTC/USDT',
        type: OrderType.MARKET,
        side: OrderSide.BUY,
        amount: 1,
        retryCount: 0,
      };

      // 添加订单
      const orderId = await orderQueue.addOrder(order);

      // 模拟订单执行失败
      jest.spyOn(orderQueue as any, 'executeOrder').mockRejectedValueOnce(new Error('Network error'));

      // 处理订单
      await orderQueue.processOrder(orderId);

      // 验证重试状态
      const status = orderQueue.getOrderStatus(orderId);
      expect(status).toBe(OrderStatus.RETRYING);
    });
  });

  describe('Monitoring and Metrics', () => {
    it('should track strategy performance metrics', async () => {
      const strategyId = 'test-strategy';
      const userId = 'test-user';

      // 开始监控
      monitor.startMonitoring(strategyId, userId);

      // 更新性能指标
      monitor.updatePerformance(strategyId, userId, {
        status: StrategyStatus.RUNNING,
        currentReturn: 0.05,
        maxDrawdown: 0.02,
        dailyReturn: 0.01,
        totalTrades: 10,
        winRate: 0.8,
      });

      // 获取性能数据
      const performance = monitor.getPerformance(strategyId, userId);
      expect(performance).toEqual({
        strategyId,
        userId,
        status: StrategyStatus.RUNNING,
        startTime: expect.any(Date),
        currentReturn: 0.05,
        maxDrawdown: 0.02,
        dailyReturn: 0.01,
        totalTrades: 10,
        winRate: 0.8,
        lastUpdate: expect.any(Date)
      });
    });
  });
}); 