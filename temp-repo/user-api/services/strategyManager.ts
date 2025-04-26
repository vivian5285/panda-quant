import { Strategy, StrategyPreset, OHLCV, Trade, StrategyStats } from '../types';
import { SuperTrendStrategy } from '../strategies/superTrendStrategy';

export class StrategyManager {
  private strategies: Map<string, Strategy>;

  constructor() {
    this.strategies = new Map();
  }

  public createStrategy(preset: StrategyPreset): string {
    let strategy: Strategy;

    switch (preset.name) {
      case 'SuperTrend':
        strategy = new SuperTrendStrategy(preset.params);
        break;
      default:
        throw new Error(`Unknown strategy preset: ${preset.name}`);
    }

    const strategyId = Math.random().toString(36).substring(7);
    this.strategies.set(strategyId, strategy);
    return strategyId;
  }

  public getStrategy(strategyId: string): Strategy {
    const strategy = this.strategies.get(strategyId);
    if (!strategy) {
      throw new Error(`Strategy not found: ${strategyId}`);
    }
    return strategy;
  }

  public removeStrategy(strategyId: string): void {
    if (!this.strategies.has(strategyId)) {
      throw new Error(`Strategy not found: ${strategyId}`);
    }
    this.strategies.delete(strategyId);
  }

  public async analyzeMarket(strategyId: string, marketData: OHLCV[]): Promise<'buy' | 'sell' | 'hold'> {
    const strategy = this.getStrategy(strategyId);
    return strategy.analyzeMarket(marketData);
  }

  public async executeTrade(strategyId: string, marketData: OHLCV[]): Promise<void> {
    const strategy = this.getStrategy(strategyId);
    await strategy.executeTrade(marketData);
  }

  public getStrategyStats(strategyId: string): StrategyStats {
    const strategy = this.getStrategy(strategyId);
    return strategy.getStats();
  }
} 