import { Strategy } from '../types';
import { ExchangeService } from './exchangeService';
import { DatabaseService } from './databaseService';
import { SuperTrendStrategy } from '../strategies/superTrendStrategy';
import { RSIStrategy } from '../strategies/rsiStrategy';
import { MACDStrategy } from '../strategies/macdStrategy';

export class StrategyExecutor {
  private exchangeService: ExchangeService;
  private databaseService: DatabaseService;

  constructor() {
    this.exchangeService = new ExchangeService();
    this.databaseService = new DatabaseService();
  }

  // 获取策略实例
  private getStrategyInstance(strategy: Strategy) {
    switch (strategy.type) {
      case 'superTrend':
        return new SuperTrendStrategy(strategy.parameters);
      case 'rsi':
        return new RSIStrategy(strategy.parameters);
      case 'macd':
        return new MACDStrategy(strategy.parameters);
      default:
        throw new Error(`Unknown strategy type: ${strategy.type}`);
    }
  }

  // 执行单个用户策略
  async executeUserStrategy(userId: string, strategy: Strategy) {
    try {
      // 获取市场数据
      const marketData = await this.exchangeService.getMarketData(
        strategy.symbol,
        strategy.timeframe
      );

      // 获取策略实例
      const strategyInstance = this.getStrategyInstance(strategy);

      // 分析市场并生成信号
      const signal = strategyInstance.analyzeMarket(marketData);

      // 如果生成交易信号，执行交易
      if (signal !== 'hold') {
        const currentPrice = await this.exchangeService.getCurrentPrice(strategy.symbol);
        const marketInfo = await this.exchangeService.getMarketInfo(strategy.symbol);

        // 计算交易数量
        const amount = strategy.amount / currentPrice;
        
        // 验证交易数量是否在限制范围内
        if (amount < marketInfo.minAmount || amount > marketInfo.maxAmount) {
          throw new Error('Trade amount is outside market limits');
        }

        // 执行交易
        const order = await this.exchangeService.executeTrade(
          strategy.symbol,
          signal,
          amount
        );

        // 记录交易
        await this.databaseService.query(
          'INSERT INTO trades (user_id, strategy_id, symbol, side, amount, price, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [
            userId,
            strategy.id,
            strategy.symbol,
            signal,
            amount,
            currentPrice,
            new Date()
          ]
        );

        return order;
      }

      return null;
    } catch (error) {
      console.error(`Error executing strategy for user ${userId}:`, error);
      throw error;
    }
  }

  // 执行所有用户策略
  async executeAllStrategies() {
    try {
      // 获取所有活跃策略
      const result = await this.databaseService.query(
        'SELECT u.id as user_id, s.* FROM strategies s JOIN users u ON s.user_id = u.id WHERE s.is_active = true'
      );

      const strategies = result.rows;

      // 并发执行所有策略
      const executions = strategies.map(strategy =>
        this.executeUserStrategy(strategy.user_id, strategy)
      );

      await Promise.all(executions);
    } catch (error) {
      console.error('Error executing all strategies:', error);
      throw error;
    }
  }

  // 获取策略统计信息
  async getStrategyStats(strategyId: string) {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM trades WHERE strategy_id = $1 ORDER BY timestamp DESC',
        [strategyId]
      );

      const trades = result.rows;
      const totalTrades = trades.length;
      const winningTrades = trades.filter(trade => trade.profit > 0).length;
      const totalProfit = trades.reduce((sum, trade) => sum + trade.profit, 0);
      const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

      return {
        totalTrades,
        winningTrades,
        totalProfit,
        winRate,
        trades
      };
    } catch (error) {
      console.error('Error getting strategy stats:', error);
      throw error;
    }
  }
} 