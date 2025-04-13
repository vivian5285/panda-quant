import { StrategyPreset, OHLCV, Trade, StrategyStats } from '../types';
import { calculateATR, calculateSuperTrend } from '../utils/indicators';
import { DatabaseService } from '../../services/databaseService';

export class SuperTrendStrategy {
  private params: StrategyPreset;
  private position: 'long' | 'short' | null = null;
  private entryPrice: number | null = null;
  private trades: Trade[] = [];
  private superTrendData: { upper: number; lower: number; trend: 'up' | 'down' }[] = [];
  private dbService: DatabaseService;

  constructor(preset: StrategyPreset) {
    this.params = preset;
    this.dbService = new DatabaseService();
  }

  async analyzeMarket(data: OHLCV[]): Promise<'buy' | 'sell' | 'hold'> {
    try {
      // Calculate ATR
      const atr = this.calculateATR(data);
      
      // Calculate SuperTrend
      const superTrend = this.calculateSuperTrend(data, atr);
      this.superTrendData = superTrend;
      
      // Generate signal
      const signal = this.generateSignal(data, superTrend);
      
      // Log strategy execution
      await this.logStrategyExecution(data[data.length - 1].timestamp, signal);
      
      return signal;
    } catch (error) {
      console.error('Error in market analysis:', error);
      return 'hold';
    }
  }

  private async logStrategyExecution(timestamp: number, signal: string) {
    try {
      await this.dbService.query(
        `INSERT INTO strategy_logs (user_id, strategy_id, profit, executed_at)
         VALUES ($1, $2, $3, $4)`,
        [
          this.params.userId,
          this.params.id,
          this.calculateCurrentProfit(),
          new Date(timestamp)
        ]
      );
    } catch (error) {
      console.error('Error logging strategy execution:', error);
    }
  }

  private calculateCurrentProfit(): number {
    if (!this.position || !this.entryPrice) return 0;
    
    const lastTrade = this.trades[this.trades.length - 1];
    if (!lastTrade) return 0;
    
    return lastTrade.profit || 0;
  }

  // 分析市场并生成交易信号
  private generateSignal(candles: OHLCV[], superTrend: { upper: number; lower: number; trend: 'up' | 'down' }[]): 'buy' | 'sell' | 'hold' {
    if (candles.length < this.params.atrPeriod! + 1) return 'hold';

    const currentTrend = superTrend[superTrend.length - 1];
    const prevTrend = superTrend[superTrend.length - 2];

    // 检查趋势强度
    const trendStrength = this.calculateTrendStrength(candles);
    if (trendStrength < this.params.trendStrengthFilter!) {
      return 'hold';
    }

    // 生成交易信号
    if (currentTrend.trend === 'up' && prevTrend.trend === 'down') {
      return 'buy';
    } else if (currentTrend.trend === 'down' && prevTrend.trend === 'up') {
      return 'sell';
    }

    return 'hold';
  }

  // 计算趋势强度
  private calculateTrendStrength(candles: OHLCV[]): number {
    const lookback = 20;
    if (candles.length < lookback) return 0;

    const recentCandles = candles.slice(-lookback);
    const closes = recentCandles.map(c => c.close);
    const highs = recentCandles.map(c => c.high);
    const lows = recentCandles.map(c => c.low);

    // 计算价格变化
    const priceChanges = closes.map((close, i) => {
      if (i === 0) return 0;
      return ((close - closes[i - 1]) / closes[i - 1]) * 100;
    });

    // 计算波动率
    const ranges = highs.map((high, i) => high - lows[i]);
    const avgRange = ranges.reduce((sum, range) => sum + range, 0) / ranges.length;
    const volatility = avgRange / closes[0] * 100;

    // 计算趋势强度
    const trendStrength = Math.abs(priceChanges.reduce((sum, change) => sum + change, 0)) / volatility;
    return Math.min(trendStrength, 1);
  }

  // 执行交易
  executeTrade(signal: 'buy' | 'sell', currentPrice: number): Trade | null {
    if (this.position !== null) {
      // 检查是否需要平仓
      if (
        (this.position === 'long' && signal === 'sell') ||
        (this.position === 'short' && signal === 'buy')
      ) {
        const profit = this.calculateProfit(currentPrice);
        const trade: Trade = {
          id: Date.now().toString(),
          symbol: 'BTC/USDT',
          entryPrice: this.entryPrice!,
          exitPrice: currentPrice,
          amount: this.params.positionSize!,
          profit,
          entryTime: Date.now() - 1000 * 60 * 15, // 假设15分钟前入场
          exitTime: Date.now(),
          type: this.position,
        };

        this.trades.push(trade);
        this.position = null;
        this.entryPrice = null;
        return trade;
      }
    } else {
      // 开新仓
      if (signal === 'buy' || signal === 'sell') {
        this.position = signal === 'buy' ? 'long' : 'short';
        this.entryPrice = currentPrice;
      }
    }

    return null;
  }

  // 计算利润
  private calculateProfit(currentPrice: number): number {
    if (!this.entryPrice) return 0;

    const priceDiff = this.position === 'long' 
      ? currentPrice - this.entryPrice 
      : this.entryPrice - currentPrice;

    return priceDiff * this.params.positionSize!;
  }

  // 检查止损止盈
  checkStopConditions(currentPrice: number): boolean {
    if (!this.entryPrice || !this.position) return false;

    const priceDiff = Math.abs(currentPrice - this.entryPrice);
    const priceDiffPercent = (priceDiff / this.entryPrice) * 100;

    // 检查止盈
    if (priceDiffPercent >= this.params.takeProfit!) {
      return true;
    }

    // 检查止损
    if (priceDiffPercent >= this.params.stopLoss!) {
      return true;
    }

    return false;
  }

  async getStats(): Promise<StrategyStats> {
    try {
      const result = await this.dbService.query(
        `SELECT 
          COUNT(*) as total_trades,
          SUM(CASE WHEN profit > 0 THEN 1 ELSE 0 END) as winning_trades,
          SUM(profit) as total_profit,
          MIN(profit) as min_profit,
          MAX(profit) as max_profit
         FROM strategy_logs
         WHERE user_id = $1 AND strategy_id = $2`,
        [this.params.userId, this.params.id]
      );

      const stats = result.rows[0];
      return {
        totalTrades: parseInt(stats.total_trades) || 0,
        winningTrades: parseInt(stats.winning_trades) || 0,
        totalProfit: parseFloat(stats.total_profit) || 0,
        minProfit: parseFloat(stats.min_profit) || 0,
        maxProfit: parseFloat(stats.max_profit) || 0,
        winRate: stats.total_trades > 0 
          ? (parseInt(stats.winning_trades) / parseInt(stats.total_trades)) * 100 
          : 0
      };
    } catch (error) {
      console.error('Error getting strategy stats:', error);
      return {
        totalTrades: 0,
        winningTrades: 0,
        totalProfit: 0,
        minProfit: 0,
        maxProfit: 0,
        winRate: 0
      };
    }
  }
} 