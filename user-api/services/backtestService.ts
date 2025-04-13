import { Strategy } from '../../strategy-engine/strategies/strategy';
import { OHLCV } from '../../strategy-engine/types';
import { DatabaseService } from './databaseService';
import { HistoricalDataService } from './historicalDataService';

export class BacktestService {
  private historicalDataService: HistoricalDataService;

  constructor() {
    this.historicalDataService = new HistoricalDataService();
  }

  // 执行回测
  async runBacktest(
    userId: string,
    strategy: Strategy,
    symbol: string,
    timeframe: string,
    startDate: Date,
    endDate: Date,
    initialCapital: number
  ) {
    try {
      // 获取历史数据
      const historicalData = await this.historicalDataService.getHistoricalData(
        symbol,
        timeframe,
        startDate,
        endDate
      );

      // 执行回测
      let capital = initialCapital;
      let maxCapital = initialCapital;
      let maxDrawdown = 0;
      let trades: any[] = [];
      let winningTrades = 0;
      let losingTrades = 0;
      let totalProfit = 0;
      let totalLoss = 0;

      for (let i = 0; i < historicalData.length; i++) {
        const data = historicalData[i];
        const signal = strategy.analyzeMarket(data);

        if (signal === 'buy' && !strategy.position) {
          const trade = strategy.executeTrade(data.close, 'buy');
          if (trade) {
            trades.push(trade);
            capital -= trade.entryPrice;
          }
        } else if (signal === 'sell' && strategy.position) {
          const trade = strategy.executeTrade(data.close, 'sell');
          if (trade) {
            trades.push(trade);
            capital += trade.exitPrice;
            if (trade.profit > 0) {
              winningTrades++;
              totalProfit += trade.profit;
            } else {
              losingTrades++;
              totalLoss += Math.abs(trade.profit);
            }
          }
        }

        // 更新最大回撤
        maxCapital = Math.max(maxCapital, capital);
        const drawdown = ((maxCapital - capital) / maxCapital) * 100;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
      }

      // 计算统计指标
      const totalTrades = trades.length;
      const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
      const averageProfit = winningTrades > 0 ? totalProfit / winningTrades : 0;
      const averageLoss = losingTrades > 0 ? totalLoss / losingTrades : 0;
      const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : 0;
      const profitPercentage = ((capital - initialCapital) / initialCapital) * 100;
      const monthlyReturn = this.calculateMonthlyReturn(initialCapital, capital, startDate, endDate);
      const { sharpeRatio, sortinoRatio } = this.calculateRiskAdjustedReturns(trades, initialCapital);

      // 保存回测结果
      const backtestResult = await this.saveBacktestResult(
        userId,
        strategy.name,
        symbol,
        timeframe,
        startDate,
        endDate,
        initialCapital,
        capital,
        profitPercentage,
        monthlyReturn,
        maxDrawdown,
        winRate,
        totalTrades,
        winningTrades,
        losingTrades,
        averageProfit,
        averageLoss,
        profitFactor,
        sharpeRatio,
        sortinoRatio
      );

      // 保存交易记录
      await this.saveBacktestTrades(backtestResult.id, trades);

      return {
        ...backtestResult,
        trades
      };
    } catch (error) {
      console.error('Error running backtest:', error);
      throw error;
    }
  }

  // 计算月度收益率
  private calculateMonthlyReturn(
    initialCapital: number,
    finalCapital: number,
    startDate: Date,
    endDate: Date
  ): number {
    const months = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return Math.pow(finalCapital / initialCapital, 1 / months) - 1;
  }

  // 计算风险调整后的收益
  private calculateRiskAdjustedReturns(trades: any[], initialCapital: number) {
    const returns = trades.map(trade => trade.profit / initialCapital);
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    const downsideReturns = returns.filter(r => r < 0);
    const downsideVariance = downsideReturns.reduce((a, b) => a + Math.pow(b, 2), 0) / returns.length;
    const downsideStdDev = Math.sqrt(downsideVariance);

    const riskFreeRate = 0.02; // 假设无风险利率为2%
    const sharpeRatio = (meanReturn - riskFreeRate) / stdDev;
    const sortinoRatio = (meanReturn - riskFreeRate) / downsideStdDev;

    return { sharpeRatio, sortinoRatio };
  }

  // 保存回测结果
  private async saveBacktestResult(
    userId: string,
    strategyName: string,
    symbol: string,
    timeframe: string,
    startDate: Date,
    endDate: Date,
    initialCapital: number,
    finalCapital: number,
    profitPercentage: number,
    monthlyReturn: number,
    maxDrawdown: number,
    winRate: number,
    totalTrades: number,
    winningTrades: number,
    losingTrades: number,
    averageProfit: number,
    averageLoss: number,
    profitFactor: number,
    sharpeRatio: number,
    sortinoRatio: number
  ) {
    const result = await DatabaseService.query(
      `INSERT INTO backtest_results (
        user_id, strategy_name, symbol, timeframe, start_date, end_date,
        initial_capital, final_capital, total_profit, profit_percentage,
        monthly_return, max_drawdown, win_rate, total_trades, winning_trades,
        losing_trades, average_profit, average_loss, profit_factor,
        sharpe_ratio, sortino_ratio
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *`,
      [
        userId, strategyName, symbol, timeframe, startDate, endDate,
        initialCapital, finalCapital, finalCapital - initialCapital, profitPercentage,
        monthlyReturn, maxDrawdown, winRate, totalTrades, winningTrades,
        losingTrades, averageProfit, averageLoss, profitFactor,
        sharpeRatio, sortinoRatio
      ]
    );

    return result.rows[0];
  }

  // 保存回测交易记录
  private async saveBacktestTrades(backtestId: number, trades: any[]) {
    for (const trade of trades) {
      await DatabaseService.query(
        `INSERT INTO backtest_trades (
          backtest_id, entry_time, exit_time, entry_price,
          exit_price, profit, type
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          backtestId,
          trade.entryTime,
          trade.exitTime,
          trade.entryPrice,
          trade.exitPrice,
          trade.profit,
          trade.type
        ]
      );
    }
  }

  // 获取用户的回测历史
  async getUserBacktestHistory(userId: string) {
    const result = await DatabaseService.query(
      `SELECT * FROM backtest_results WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  // 获取回测详情
  async getBacktestDetails(backtestId: number) {
    const [result, trades] = await Promise.all([
      DatabaseService.query(
        `SELECT * FROM backtest_results WHERE id = $1`,
        [backtestId]
      ),
      DatabaseService.query(
        `SELECT * FROM backtest_trades WHERE backtest_id = $1 ORDER BY entry_time`,
        [backtestId]
      )
    ]);

    return {
      ...result.rows[0],
      trades: trades.rows
    };
  }
} 