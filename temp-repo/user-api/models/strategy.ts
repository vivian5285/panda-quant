import { Strategy as IStrategy, OHLCV, Trade, StrategyStats } from '../types';

export abstract class Strategy implements IStrategy {
  protected position: 'long' | 'short' | null = null;
  protected entryPrice: number | null = null;
  protected trades: Trade[] = [];

  constructor(protected parameters: Record<string, number>) {}

  abstract analyzeMarket(data: OHLCV[]): 'buy' | 'sell' | 'hold';

  async executeTrade(price: number, type: 'buy' | 'sell'): Promise<void> {
    if (type === 'buy' && !this.position) {
      this.position = 'long';
      this.entryPrice = price;
      this.trades.push({
        type: 'buy',
        price,
        timestamp: new Date(),
        profit: 0
      });
    } else if (type === 'sell' && this.position) {
      const profit = this.position === 'long' 
        ? price - this.entryPrice!
        : this.entryPrice! - price;
      
      this.trades.push({
        type: 'sell',
        price,
        timestamp: new Date(),
        profit
      });

      this.position = null;
      this.entryPrice = null;
    }
  }

  getStats(): StrategyStats {
    const totalProfit = this.trades.reduce((sum, trade) => sum + trade.profit, 0);
    const winningTrades = this.trades.filter(trade => trade.profit > 0);
    const winRate = this.trades.length > 0 
      ? winningTrades.length / this.trades.length 
      : 0;

    let maxDrawdown = 0;
    let peak = 0;
    let current = 0;

    for (const trade of this.trades) {
      current += trade.profit;
      if (current > peak) {
        peak = current;
      }
      const drawdown = (peak - current) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    return {
      totalProfit,
      maxDrawdown,
      winRate,
      trades: this.trades
    };
  }
} 