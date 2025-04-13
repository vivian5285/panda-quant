import { Strategy, OHLCV, Trade } from '../types';

export class MovingAverageStrategy implements Strategy {
  private shortPeriod: number;
  private longPeriod: number;
  private position: 'long' | 'short' | 'none';
  private entryPrice: number;
  private trades: Trade[];

  constructor(params: { shortPeriod: number; longPeriod: number }) {
    this.shortPeriod = params.shortPeriod;
    this.longPeriod = params.longPeriod;
    this.position = 'none';
    this.entryPrice = 0;
    this.trades = [];
  }

  public analyzeMarket(data: OHLCV[]): 'buy' | 'sell' | 'hold' {
    if (data.length < this.longPeriod) {
      return 'hold';
    }

    const shortMA = this.calculateMA(data, this.shortPeriod);
    const longMA = this.calculateMA(data, this.longPeriod);

    if (shortMA > longMA && this.position !== 'long') {
      return 'buy';
    } else if (shortMA < longMA && this.position !== 'short') {
      return 'sell';
    }

    return 'hold';
  }

  public async executeTrade(signal: 'buy' | 'sell', price: number): Promise<void> {
    if (signal === 'buy' && this.position !== 'long') {
      if (this.position === 'short') {
        // 平空仓
        const profit = this.entryPrice - price;
        this.trades.push({
          timestamp: Date.now(),
          type: 'buy',
          price,
          quantity: 1,
          profit
        });
      }
      // 开多仓
      this.position = 'long';
      this.entryPrice = price;
      this.trades.push({
        timestamp: Date.now(),
        type: 'buy',
        price,
        quantity: 1
      });
    } else if (signal === 'sell' && this.position !== 'short') {
      if (this.position === 'long') {
        // 平多仓
        const profit = price - this.entryPrice;
        this.trades.push({
          timestamp: Date.now(),
          type: 'sell',
          price,
          quantity: 1,
          profit
        });
      }
      // 开空仓
      this.position = 'short';
      this.entryPrice = price;
      this.trades.push({
        timestamp: Date.now(),
        type: 'sell',
        price,
        quantity: 1
      });
    }
  }

  public getStats() {
    const profitableTrades = this.trades.filter(trade => trade.profit && trade.profit > 0);
    const totalProfit = this.trades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
    const winRate = this.trades.length > 0 ? (profitableTrades.length / this.trades.length) * 100 : 0;

    // 计算最大回撤
    let maxDrawdown = 0;
    let peak = 0;
    let currentBalance = 0;

    for (const trade of this.trades) {
      currentBalance += trade.profit || 0;
      if (currentBalance > peak) {
        peak = currentBalance;
      }
      const drawdown = ((peak - currentBalance) / peak) * 100;
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

  private calculateMA(data: OHLCV[], period: number): number {
    const closes = data.slice(-period).map(d => d.close);
    return closes.reduce((sum, close) => sum + close, 0) / period;
  }
} 