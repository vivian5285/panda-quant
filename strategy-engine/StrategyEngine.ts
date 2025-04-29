import { Strategy, StrategyPreset, OHLCV, Trade } from './types';
import { SuperTrendStrategy } from './strategies/superTrendStrategy';
import config from './config';
import { DatabaseService } from './services/databaseService';
import { Order } from './types/order';

export class StrategyEngine {
  private strategies: Map<string, Strategy>;
  private databaseService: DatabaseService;
  private updateInterval: NodeJS.Timeout | null;

  constructor() {
    this.strategies = new Map();
    this.databaseService = new DatabaseService();
    this.updateInterval = null;
  }

  public async initialize(): Promise<void> {
    // 初始化数据库连接
    await this.databaseService.initialize();
    
    // 创建必要的数据库表
    await this.databaseService.createTables();
  }

  public async addStrategy(preset: StrategyPreset): Promise<string> {
    if (this.strategies.size >= config.engine.maxStrategies) {
      throw new Error('已达到最大策略数量限制');
    }

    let strategy: Strategy;
    switch (preset.name) {
      case 'SuperTrend':
        strategy = new SuperTrendStrategy(preset.params);
        break;
      // 可以添加其他策略类型
      default:
        throw new Error(`不支持的策略类型: ${preset.name}`);
    }

    const strategyId = Date.now().toString();
    this.strategies.set(strategyId, strategy);

    return strategyId;
  }

  public async removeStrategy(strategyId: string): Promise<void> {
    if (!this.strategies.has(strategyId)) {
      throw new Error(`策略不存在: ${strategyId}`);
    }
    this.strategies.delete(strategyId);
  }

  public async executeStrategy(strategy: StrategyPreset, parameters: Record<string, any>): Promise<Order[]> {
    if (!this.strategies.has(strategy.id)) {
      throw new Error(`策略不存在: ${strategy.id}`);
    }

    const strategyInstance = this.strategies.get(strategy.id);
    if (!strategyInstance) {
      throw new Error(`策略实例不存在: ${strategy.id}`);
    }

    try {
      const orders = await strategyInstance.execute(parameters);
      return orders;
    } catch (error) {
      console.error(`执行策略失败: ${strategy.id}`, error);
      throw error;
    }
  }

  public async updateMarketData(data: OHLCV): Promise<void> {
    // 保存历史数据
    await this.databaseService.query(
      'INSERT INTO historical_data (timestamp, open, high, low, close, volume) VALUES ($1, $2, $3, $4, $5, $6)',
      [data.timestamp, data.open, data.high, data.low, data.close, data.volume]
    );

    // 更新所有策略
    for (const [strategyId, strategy] of this.strategies) {
      try {
        const signal = strategy.analyzeMarket(data);
        if (signal !== 'hold') {
          const trade = await strategy.executeTrade(signal, data.close);
          if (trade) {
            // 保存交易记录
            await this.databaseService.query(
              'INSERT INTO backtest_trades (strategy_id, timestamp, type, price, quantity, profit) VALUES ($1, $2, $3, $4, $5, $6)',
              [strategyId, trade.timestamp, trade.type, trade.price, trade.quantity, trade.profit]
            );
          }
        }
      } catch (error) {
        console.error(`策略 ${strategyId} 更新失败:`, error);
      }
    }
  }

  public start(): void {
    if (this.updateInterval) {
      return;
    }

    this.updateInterval = setInterval(async () => {
      try {
        // 这里应该从交易所获取最新的市场数据
        // const marketData = await this.exchange.getMarketData();
        // await this.updateMarketData(marketData);
      } catch (error) {
        console.error('策略引擎更新失败:', error);
      }
    }, config.engine.updateInterval);
  }

  public stop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  public async getStrategyStats(strategyId: string) {
    const strategy = this.strategies.get(strategyId);
    if (!strategy) {
      throw new Error(`策略不存在: ${strategyId}`);
    }
    return strategy.getStats();
  }

  public async cleanup(): Promise<void> {
    this.stop();
    await this.databaseService.close();
  }
} 