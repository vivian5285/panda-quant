import { Strategy } from '../models/strategy';
import { OHLCV } from '../types';
import { SuperTrendStrategy } from '../strategies/superTrendStrategy';

export class StrategyEngine {
  private strategy: Strategy;
  private parameters: Record<string, number>;

  constructor(strategyType: string, parameters: Record<string, number>) {
    this.parameters = parameters;
    this.strategy = this.createStrategy(strategyType);
  }

  private createStrategy(strategyType: string): Strategy {
    switch (strategyType) {
      case 'superTrend':
        return new SuperTrendStrategy(this.parameters);
      default:
        throw new Error(`Unknown strategy type: ${strategyType}`);
    }
  }

  async runBacktest(historicalData: OHLCV[]): Promise<{
    totalProfit: number;
    maxDrawdown: number;
    winRate: number;
    sharpeRatio: number;
    sortinoRatio: number;
    volatility: number;
  }> {
    const trades: Trade[] = [];
    let currentPrice = 0;
    let peak = 0;
    let drawdown = 0;
    let maxDrawdown = 0;
    let wins = 0;
    let losses = 0;

    for (const data of historicalData) {
      const signal = this.strategy.analyzeMarket([data]);
      
      if (signal === 'buy' && !this.strategy.position) {
        await this.strategy.executeTrade(data.close, 'buy');
        currentPrice = data.close;
        peak = data.close;
      } else if (signal === 'sell' && this.strategy.position) {
        await this.strategy.executeTrade(data.close, 'sell');
        currentPrice = data.close;
        
        if (data.close > currentPrice) {
          wins++;
        } else {
          losses++;
        }
      }

      // 计算最大回撤
      if (data.close > peak) {
        peak = data.close;
      }
      drawdown = (peak - data.close) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    const totalProfit = this.strategy.getStats().totalProfit;
    const winRate = wins / (wins + losses);
    const returns = this.calculateReturns(historicalData);
    const sharpeRatio = this.calculateSharpeRatio(returns);
    const sortinoRatio = this.calculateSortinoRatio(returns);
    const volatility = this.calculateVolatility(returns);

    return {
      totalProfit,
      maxDrawdown,
      winRate,
      sharpeRatio,
      sortinoRatio,
      volatility
    };
  }

  private calculateReturns(data: OHLCV[]): number[] {
    const returns: number[] = [];
    for (let i = 1; i < data.length; i++) {
      returns.push((data[i].close - data[i-1].close) / data[i-1].close);
    }
    return returns;
  }

  private calculateSharpeRatio(returns: number[]): number {
    const riskFreeRate = 0.02; // 假设无风险利率为2%
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / returns.length
    );
    return (meanReturn - riskFreeRate) / stdDev;
  }

  private calculateSortinoRatio(returns: number[]): number {
    const riskFreeRate = 0.02;
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const downsideReturns = returns.filter(r => r < 0);
    const downsideStdDev = Math.sqrt(
      downsideReturns.reduce((a, b) => a + Math.pow(b, 2), 0) / downsideReturns.length
    );
    return (meanReturn - riskFreeRate) / downsideStdDev;
  }

  private calculateVolatility(returns: number[]): number {
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    return Math.sqrt(
      returns.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / returns.length
    );
  }
} 