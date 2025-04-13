import { Strategy, StrategyPreset } from './types';
import { StrategyFactory } from './strategyFactory';

export class StrategyManager {
  private strategies: Map<string, Strategy>;
  private factory: StrategyFactory;

  constructor() {
    this.strategies = new Map();
    this.factory = StrategyFactory.getInstance();
  }

  public createStrategy(preset: StrategyPreset): string {
    const strategy = this.factory.createStrategy(preset);
    const strategyId = Math.random().toString(36).substring(7);
    this.strategies.set(strategyId, strategy);
    return strategyId;
  }

  public getStrategy(strategyId: string): Strategy | undefined {
    return this.strategies.get(strategyId);
  }

  public removeStrategy(strategyId: string): boolean {
    return this.strategies.delete(strategyId);
  }

  public getAllStrategies(): Map<string, Strategy> {
    return this.strategies;
  }

  public getAvailableStrategies(): string[] {
    return this.factory.getAvailableStrategies();
  }
} 