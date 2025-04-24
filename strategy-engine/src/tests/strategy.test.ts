import { executeStrategy } from '../services/strategy';
import { StrategyExecutionRequest } from '../interfaces/api';
import { StrategyError } from '../utils/error';
import { StrategyExecutionService } from '../services/StrategyExecutionService';
import { BacktestService } from '../services/BacktestService';
import { RiskManagementService } from '../services/RiskManagementService';
import { PerformanceTracker } from '../services/PerformanceTracker';

describe('Strategy Execution', () => {
  const mockRequest: StrategyExecutionRequest = {
    strategyId: 'test-strategy',
    userId: 'test-user',
    parameters: {
      symbol: 'BTC/USDT',
      timeframe: '1h',
    },
  };

  it('should execute strategy successfully', async () => {
    const result = await executeStrategy(mockRequest);
    expect(result.status).toBe('completed');
    expect(result.executionId).toBeDefined();
    expect(result.result).toBeDefined();
  });

  it('should handle invalid strategy ID', async () => {
    const invalidRequest = {
      ...mockRequest,
      strategyId: 'invalid-strategy',
    };

    await expect(executeStrategy(invalidRequest)).rejects.toThrow(StrategyError);
  });

  it('should handle invalid parameters', async () => {
    const invalidRequest = {
      ...mockRequest,
      parameters: {
        invalid: 'parameter',
      },
    };

    await expect(executeStrategy(invalidRequest)).rejects.toThrow(StrategyError);
  });
});

describe('Strategy Tests', () => {
  let strategyService: StrategyExecutionService;
  let backtestService: BacktestService;
  let riskService: RiskManagementService;
  let performanceTracker: PerformanceTracker;

  beforeEach(() => {
    strategyService = StrategyExecutionService.getInstance();
    backtestService = BacktestService.getInstance();
    riskService = RiskManagementService.getInstance();
    performanceTracker = new PerformanceTracker();
  });

  describe('High Frequency Strategy', () => {
    test('should achieve monthly return > 50%', async () => {
      const result = await backtestService.runBacktest('high-frequency', {
        exchange: 'binance',
        symbol: 'BTC/USDT',
        timeframe: '1m',
        startTime: '2023-01-01',
        endTime: '2023-12-31',
        initialCapital: 10000
      });

      expect(result.monthlyReturn).toBeGreaterThan(0.5);
    });

    test('should maintain drawdown < 10%', async () => {
      const result = await backtestService.runBacktest('high-frequency', {
        exchange: 'binance',
        symbol: 'BTC/USDT',
        timeframe: '1m',
        startTime: '2023-01-01',
        endTime: '2023-12-31',
        initialCapital: 10000
      });

      expect(result.maxDrawdown).toBeLessThan(0.1);
    });
  });

  describe('Risk Management', () => {
    test('should approve valid strategy execution', async () => {
      const riskCheck = await riskService.checkRisk('user1', 'high-frequency', 10000);
      expect(riskCheck.isApproved).toBe(true);
    });

    test('should reject excessive leverage', async () => {
      const riskCheck = await riskService.checkRisk('user1', 'high-frequency', 100000);
      expect(riskCheck.isApproved).toBe(false);
    });
  });

  describe('Performance Tracking', () => {
    test('should record strategy performance', async () => {
      const performance = {
        monthlyReturn: 0.6,
        totalReturn: 1.2,
        maxDrawdown: 0.08,
        sharpeRatio: 2.5,
        trades: []
      };

      performanceTracker.recordPerformance('high-frequency', performance);
      const recorded = performanceTracker.getPerformance('high-frequency');
      
      expect(recorded.monthlyReturn).toBe(0.6);
      expect(recorded.maxDrawdown).toBe(0.08);
    });
  });

  describe('Strategy Execution', () => {
    test('should execute strategy successfully', async () => {
      const execution = await strategyService.executeStrategy('high-frequency', {
        userId: 'user1',
        amount: 10000,
        exchange: 'binance'
      });

      expect(execution.status).toBe('success');
      expect(execution.trades.length).toBeGreaterThan(0);
    });

    test('should handle execution errors', async () => {
      await expect(strategyService.executeStrategy('invalid-strategy', {
        userId: 'user1',
        amount: 10000,
        exchange: 'binance'
      })).rejects.toThrow();
    });
  });
}); 