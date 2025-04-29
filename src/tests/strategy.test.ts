import { Strategy } from '../models/strategy';
import { StrategyService } from '../services/strategyService';
import { StrategyExecutionResult } from '../types/strategy';

describe('Strategy Tests', () => {
  let strategyService: StrategyService;

  beforeEach(() => {
    strategyService = new StrategyService();
  });

  it('should execute strategy correctly', async () => {
    const strategyData = {
      id: 'test-strategy-1',
      userId: 'user-1',
      name: 'Test Strategy',
      description: 'A test strategy',
      riskLevel: 'medium' as const,
      active: true,
      parameters: {}
    };

    const strategy = new Strategy(strategyData);
    const result = await strategyService.executeStrategy(strategy.id);

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.trades).toBeInstanceOf(Array);
    expect(result.metrics).toBeDefined();
  });

  it('should handle strategy execution errors', async () => {
    const strategyData = {
      id: 'test-strategy-2',
      userId: 'user-1',
      name: 'Failing Strategy',
      description: 'A strategy that will fail',
      riskLevel: 'high' as const,
      active: true,
      parameters: {}
    };

    const strategy = new Strategy(strategyData);
    const result = await strategyService.executeStrategy(strategy.id);

    expect(result).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();
  });
}); 