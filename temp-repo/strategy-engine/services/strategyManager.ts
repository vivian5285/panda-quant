import { Strategy, StrategyPreset } from '../types';
import { DatabaseService } from '../../user-api/services/databaseService';
import { SuperTrendStrategy } from '../strategies/superTrendStrategy';

export class StrategyManager {
  private strategies: Map<string, Strategy>;
  private databaseService: DatabaseService;

  constructor() {
    this.strategies = new Map();
    this.databaseService = new DatabaseService();
  }

  public async initialize(): Promise<void> {
    // 从数据库加载策略配置
    const result = await this.databaseService.query('SELECT * FROM strategies');
    for (const row of result.rows) {
      const strategy = this.createStrategy(row);
      if (strategy) {
        this.strategies.set(row.id, strategy);
      }
    }
  }

  public async addStrategy(preset: StrategyPreset): Promise<string> {
    const strategyId = Date.now().toString();
    const strategy = this.createStrategy({ id: strategyId, ...preset });

    if (!strategy) {
      throw new Error(`不支持的策略类型: ${preset.name}`);
    }

    // 保存到数据库
    await this.databaseService.query(
      'INSERT INTO strategies (id, name, params) VALUES ($1, $2, $3)',
      [strategyId, preset.name, JSON.stringify(preset.params)]
    );

    this.strategies.set(strategyId, strategy);
    return strategyId;
  }

  public async updateStrategy(strategyId: string, params: any): Promise<void> {
    const strategy = this.strategies.get(strategyId);
    if (!strategy) {
      throw new Error(`策略不存在: ${strategyId}`);
    }

    // 更新数据库
    await this.databaseService.query(
      'UPDATE strategies SET params = $1 WHERE id = $2',
      [JSON.stringify(params), strategyId]
    );

    // 重新创建策略实例
    const newStrategy = this.createStrategy({ id: strategyId, params });
    if (newStrategy) {
      this.strategies.set(strategyId, newStrategy);
    }
  }

  public async removeStrategy(strategyId: string): Promise<void> {
    if (!this.strategies.has(strategyId)) {
      throw new Error(`策略不存在: ${strategyId}`);
    }

    // 从数据库删除
    await this.databaseService.query('DELETE FROM strategies WHERE id = $1', [strategyId]);

    this.strategies.delete(strategyId);
  }

  public getStrategy(strategyId: string): Strategy | undefined {
    return this.strategies.get(strategyId);
  }

  public getAllStrategies(): Map<string, Strategy> {
    return this.strategies;
  }

  private createStrategy(config: any): Strategy | null {
    switch (config.name) {
      case 'SuperTrend':
        return new SuperTrendStrategy(config.params);
      // 可以添加其他策略类型
      default:
        return null;
    }
  }
} 