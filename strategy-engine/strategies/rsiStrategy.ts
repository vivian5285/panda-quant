import { Strategy, OHLCV, Trade } from '../types';

export class RSIStrategy implements Strategy {
  private period: number;
  private overbought: number;
  private oversold: number;
  private position: 'long' | 'short' | 'none';
  private entryPrice: number;
  private trades: Trade[];

  constructor(params: { period: number; overbought: number; oversold: number }) {
    this.period = params.period;
    this.overbought = params.overbought;
    this.oversold = params.oversold;
    this.position = 'none';
    this.entryPrice = 0;
    this.trades = [];
  }

  public analyzeMarket(data: OHLCV[]): 'buy' | 'sell' | 'hold' {
    if (data.length < this.period + 1) {
      return 'hold';
    }

    const rsi = this.calculateRSI(data);

    if (rsi < this.oversold && this.position !== 'long') {
      return 'buy';
    } else if (rsi > this.overbought && this.position !== 'short') {
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

  private calculateRSI(data: OHLCV[]): number {
    const closes = data.map(d => d.close);
    const changes = closes.slice(1).map((close, i) => close - closes[i]);
    
    const gains = changes.map(change => change > 0 ? change : 0);
    const losses = changes.map(change => change < 0 ? -change : 0);
    
    const avgGain = this.calculateSMA(gains, this.period);
    const avgLoss = this.calculateSMA(losses, this.period);
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  private calculateSMA(data: number[], period: number): number {
    if (data.length < period) {
      return 0;
    }
    const sum = data.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  }
} 