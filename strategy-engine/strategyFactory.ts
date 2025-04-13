import { Strategy, StrategyPreset } from './types';
import { SuperTrendStrategy } from './strategies/superTrendStrategy';

export class StrategyFactory {
  private static instance: StrategyFactory;
  private strategies: Map<string, new (preset: StrategyPreset) => Strategy>;

  private constructor() {
    this.strategies = new Map();
    this.registerStrategies();
  }

  public static getInstance(): StrategyFactory {
    if (!StrategyFactory.instance) {
      StrategyFactory.instance = new StrategyFactory();
    }
    return StrategyFactory.instance;
  }

  private registerStrategies(): void {
    this.strategies.set('SuperTrend', SuperTrendStrategy);
    // 在这里注册其他策略
  }

  public createStrategy(preset: StrategyPreset): Strategy {
    const StrategyClass = this.strategies.get(preset.name);
    if (!StrategyClass) {
      throw new Error(`Unknown strategy type: ${preset.name}`);
    }
    return new StrategyClass(preset);
  }

  public getAvailableStrategies(): string[] {
    return Array.from(this.strategies.keys());
  }
} 