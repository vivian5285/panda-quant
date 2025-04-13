import { Strategy, StrategyPreset } from '../types';
import { SuperTrendStrategy } from '../strategies/superTrendStrategy';

export class StrategyManager {
  private strategies: Map<string, Strategy>;

  constructor() {
    this.strategies = new Map();
  }

  public initialize(): void {
    // 初始化策略管理器
    console.log('Strategy manager initialized');
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

    const strategyId = this.generateStrategyId();
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

  private generateStrategyId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
} 