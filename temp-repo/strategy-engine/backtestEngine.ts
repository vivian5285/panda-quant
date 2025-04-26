import { Strategy } from './strategies/strategy';
import { OHLCV } from './types';
import { DatabaseService } from '../user-api/services/databaseService';

export class BacktestEngine {
  private strategy: Strategy;
  private historicalData: OHLCV[];
  private initialCapital: number;
  private currentCapital: number;
  private maxCapital: number;
  private trades: any[] = [];
  private processingBatchSize = 1000; // 每批处理的数据量

  constructor(strategy: Strategy, historicalData: OHLCV[], initialCapital: number) {
    this.strategy = strategy;
    this.historicalData = historicalData;
    this.initialCapital = initialCapital;
    this.currentCapital = initialCapital;
    this.maxCapital = initialCapital;
  }

  // 异步运行回测
  async run(): Promise<any> {
    const totalBatches = Math.ceil(this.historicalData.length / this.processingBatchSize);
    
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const startIndex = batchIndex * this.processingBatchSize;
      const endIndex = Math.min(startIndex + this.processingBatchSize, this.historicalData.length);
      const batchData = this.historicalData.slice(startIndex, endIndex);

      // 使用setTimeout让出主线程，避免阻塞
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // 处理当前批次的数据
      await this.processBatch(batchData);
    }

    return this.calculateResults();
  }

  // 处理一批数据
  private async processBatch(batchData: OHLCV[]): Promise<void> {
    for (const data of batchData) {
      const signal = this.strategy.analyzeMarket(data);
      
      if (signal === 'buy' && !this.strategy.position) {
        const trade = this.strategy.executeTrade(data.close, 'buy');
        if (trade) {
          this.trades.push(trade);
          this.currentCapital -= trade.entryPrice;
        }
      } else if (signal === 'sell' && this.strategy.position) {
        const trade = this.strategy.executeTrade(data.close, 'sell');
        if (trade) {
          this.trades.push(trade);
          this.currentCapital += trade.exitPrice;
        }
      }

      // 更新最大回撤
      this.maxCapital = Math.max(this.maxCapital, this.currentCapital);
    }
  }

  // 计算回测结果
  private calculateResults(): any {
    const winningTrades = this.trades.filter(trade => trade.profit > 0);
    const losingTrades = this.trades.filter(trade => trade.profit <= 0);
    
    const totalProfit = this.currentCapital - this.initialCapital;
    const profitPercentage = (totalProfit / this.initialCapital) * 100;
    const maxDrawdown = ((this.maxCapital - Math.min(...this.trades.map(t => t.exitPrice))) / this.maxCapital) * 100;
    const winRate = (winningTrades.length / this.trades.length) * 100;
    
    const averageProfit = winningTrades.length > 0 
      ? winningTrades.reduce((sum, trade) => sum + trade.profit, 0) / winningTrades.length 
      : 0;
    
    const averageLoss = losingTrades.length > 0 
      ? Math.abs(losingTrades.reduce((sum, trade) => sum + trade.profit, 0) / losingTrades.length)
      : 0;
    
    const profitFactor = averageLoss > 0 ? averageProfit / averageLoss : 0;
    
    // 计算夏普比率和索提诺比率
    const { sharpeRatio, sortinoRatio } = this.calculateRiskAdjustedReturns();

    return {
      totalProfit,
      profitPercentage,
      maxDrawdown,
      winRate,
      totalTrades: this.trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      averageProfit,
      averageLoss,
      profitFactor,
      sharpeRatio,
      sortinoRatio,
      trades: this.trades
    };
  }

  // 计算风险调整后的收益
  private calculateRiskAdjustedReturns(): { sharpeRatio: number; sortinoRatio: number } {
    const returns = this.trades.map(trade => trade.profit / this.initialCapital);
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    
    // 计算标准差
    const variance = returns.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    // 计算下行标准差
    const downsideReturns = returns.filter(r => r < 0);
    const downsideVariance = downsideReturns.reduce((a, b) => a + Math.pow(b, 2), 0) / returns.length;
    const downsideStdDev = Math.sqrt(downsideVariance);
    
    const riskFreeRate = 0.02; // 假设无风险利率为2%
    const sharpeRatio = (meanReturn - riskFreeRate) / stdDev;
    const sortinoRatio = (meanReturn - riskFreeRate) / downsideStdDev;
    
    return { sharpeRatio, sortinoRatio };
  }
} 