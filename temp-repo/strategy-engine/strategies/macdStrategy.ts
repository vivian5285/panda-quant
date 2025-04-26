import { Strategy, OHLCV, Trade } from '../types';

export class MACDStrategy implements Strategy {
  private fastPeriod: number;
  private slowPeriod: number;
  private signalPeriod: number;
  private position: 'long' | 'short' | 'none';
  private entryPrice: number;
  private trades: Trade[];

  constructor(params: { fastPeriod: number; slowPeriod: number; signalPeriod: number }) {
    this.fastPeriod = params.fastPeriod;
    this.slowPeriod = params.slowPeriod;
    this.signalPeriod = params.signalPeriod;
    this.position = 'none';
    this.entryPrice = 0;
    this.trades = [];
  }

  public analyzeMarket(data: OHLCV[]): 'buy' | 'sell' | 'hold' {
    if (data.length < this.slowPeriod + this.signalPeriod) {
      return 'hold';
    }

    const { macd, signal } = this.calculateMACD(data);

    if (macd > signal && this.position !== 'long') {
      return 'buy';
    } else if (macd < signal && this.position !== 'short') {
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

  private calculateMACD(data: OHLCV[]): { macd: number; signal: number } {
    const closes = data.map(d => d.close);
    const fastEMA = this.calculateEMA(closes, this.fastPeriod);
    const slowEMA = this.calculateEMA(closes, this.slowPeriod);
    
    const macdLine = fastEMA - slowEMA;
    const signalLine = this.calculateEMA([macdLine], this.signalPeriod);
    
    return {
      macd: macdLine,
      signal: signalLine
    };
  }

  private calculateEMA(data: number[], period: number): number {
    const k = 2 / (period + 1);
    let ema = data[0];
    
    for (let i = 1; i < data.length; i++) {
      ema = data[i] * k + ema * (1 - k);
    }
    
    return ema;
  }
} 