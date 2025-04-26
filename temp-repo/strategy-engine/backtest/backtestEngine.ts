import { OHLCV, Trade, BacktestResult, StrategyPreset } from '../types';
import { ScalpingStrategy } from '../strategies/scalpingStrategy';
import { SuperTrendStrategy } from '../strategies/superTrendStrategy';
import { GridStrategy } from '../strategies/gridStrategy';

export class BacktestEngine {
  static async run(
    historicalData: OHLCV[],
    strategyParams: StrategyPreset,
    initialCapital: number
  ): Promise<BacktestResult> {
    try {
      // 根据策略类型选择对应的策略类
      let strategy;
      switch (strategyParams.name) {
        case 'Scalping':
          strategy = new ScalpingStrategy(strategyParams);
          break;
        case 'SuperTrend':
          strategy = new SuperTrendStrategy(strategyParams);
          break;
        case 'Grid':
          strategy = new GridStrategy(strategyParams);
          break;
        default:
          throw new Error('Unsupported strategy type');
      }

      // 运行回测
      const trades: Trade[] = [];
      let currentCapital = initialCapital;
      let peakCapital = initialCapital;
      let maxDrawdown = 0;

      for (let i = 0; i < historicalData.length; i++) {
        const currentData = historicalData[i];
        const signal = strategy.analyzeMarket(historicalData.slice(0, i + 1));
        
        if (signal !== 'hold') {
          const trade = strategy.executeTrade(signal, currentData.close);
          if (trade) {
            trades.push(trade);
            currentCapital += trade.profit;
            
            // 更新最大回撤
            if (currentCapital > peakCapital) {
              peakCapital = currentCapital;
            }
            const drawdown = (peakCapital - currentCapital) / peakCapital;
            if (drawdown > maxDrawdown) {
              maxDrawdown = drawdown;
            }
          }
        }
      }

      // 计算统计信息
      const totalProfit = currentCapital - initialCapital;
      const profitPercentage = (totalProfit / initialCapital) * 100;
      const winningTrades = trades.filter(trade => trade.profit > 0).length;
      const winRate = (winningTrades / trades.length) * 100;

      // 计算月化收益率
      const startDate = new Date(historicalData[0].timestamp);
      const endDate = new Date(historicalData[historicalData.length - 1].timestamp);
      const months = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      const monthlyReturn = profitPercentage / months;

      return {
        totalProfit,
        profitPercentage,
        monthlyReturn,
        maxDrawdown,
        winRate,
        trades,
        initialCapital,
        finalCapital: currentCapital,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        strategyName: strategyParams.name,
        riskLevel: strategyParams.riskLevel,
      };
    } catch (error) {
      console.error('Error in backtest engine:', error);
      throw error;
    }
  }
} 