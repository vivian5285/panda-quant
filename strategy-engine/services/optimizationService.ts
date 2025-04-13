import { Strategy, OHLCV } from '../types';
import { BacktestService } from './backtestService';
import { DatabaseService } from '../../user-api/services/databaseService';

export class OptimizationService {
  private backtestService: BacktestService;
  private databaseService: DatabaseService;

  constructor() {
    this.backtestService = new BacktestService();
    this.databaseService = new DatabaseService();
  }

  public async optimizeStrategy(
    strategy: Strategy,
    symbol: string,
    timeframe: string,
    startTime: number,
    endTime: number,
    paramRanges: Record<string, { min: number; max: number; step: number }>
  ): Promise<Record<string, number>> {
    const bestParams: Record<string, number> = {};
    let bestProfit = -Infinity;

    // 生成参数组合
    const paramCombinations = this.generateParamCombinations(paramRanges);

    // 对每个参数组合进行回测
    for (const params of paramCombinations) {
      const strategyInstance = this.createStrategyInstance(strategy.constructor.name, params);
      const stats = await this.backtestService.runBacktest(
        strategyInstance,
        symbol,
        timeframe,
        startTime,
        endTime
      );

      // 保存回测结果
      await this.saveOptimizationResult(
        strategy.constructor.name,
        params,
        stats.totalProfit,
        stats.maxDrawdown,
        stats.winRate
      );

      // 更新最佳参数
      if (stats.totalProfit > bestProfit) {
        bestProfit = stats.totalProfit;
        bestParams = params;
      }
    }

    return bestParams;
  }

  private generateParamCombinations(
    paramRanges: Record<string, { min: number; max: number; step: number }>
  ): Record<string, number>[] {
    const combinations: Record<string, number>[] = [{}];
    
    for (const [param, range] of Object.entries(paramRanges)) {
      const newCombinations: Record<string, number>[] = [];
      
      for (const combination of combinations) {
        for (let value = range.min; value <= range.max; value += range.step) {
          newCombinations.push({ ...combination, [param]: value });
        }
      }
      
      combinations.length = 0;
      combinations.push(...newCombinations);
    }
    
    return combinations;
  }

  private createStrategyInstance(strategyName: string, params: Record<string, number>): Strategy {
    switch (strategyName) {
      case 'SuperTrendStrategy':
        return new (require('./strategies/superTrendStrategy').SuperTrendStrategy)(params);
      case 'MovingAverageStrategy':
        return new (require('./strategies/movingAverageStrategy').MovingAverageStrategy)(params);
      case 'RSIStrategy':
        return new (require('./strategies/rsiStrategy').RSIStrategy)(params);
      case 'MACDStrategy':
        return new (require('./strategies/macdStrategy').MACDStrategy)(params);
      default:
        throw new Error(`不支持的策略类型: ${strategyName}`);
    }
  }

  private async saveOptimizationResult(
    strategyName: string,
    params: Record<string, number>,
    totalProfit: number,
    maxDrawdown: number,
    winRate: number
  ): Promise<void> {
    await this.databaseService.query(
      'INSERT INTO optimization_results (strategy_name, params, total_profit, max_drawdown, win_rate) VALUES ($1, $2, $3, $4, $5)',
      [strategyName, JSON.stringify(params), totalProfit, maxDrawdown, winRate]
    );
  }

  public async getOptimizationHistory(strategyName: string): Promise<any[]> {
    const result = await this.databaseService.query(
      'SELECT * FROM optimization_results WHERE strategy_name = $1 ORDER BY total_profit DESC',
      [strategyName]
    );
    return result.rows;
  }
} 