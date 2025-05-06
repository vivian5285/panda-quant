import { Strategy } from '../models/Strategy';
import { SuperTrendStrategy } from '../strategies/superTrendStrategy';
import { StrategyPreset } from '../types';

export class StrategyFactory {
  static createStrategy(preset: StrategyPreset): Strategy {
    switch (preset.name) {
      case 'SuperTrend':
        return new SuperTrendStrategy(preset.params);
      default:
        throw new Error(`Unknown strategy: ${preset.name}`);
    }
  }
} 