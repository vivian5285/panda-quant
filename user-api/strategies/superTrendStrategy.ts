import { Strategy } from '../models/strategy';
import { OHLCV } from '../types';

export class SuperTrendStrategy extends Strategy {
  private atr: number[] = [];
  private upperBand: number[] = [];
  private lowerBand: number[] = [];
  private trend: ('up' | 'down')[] = [];

  constructor(parameters: Record<string, number>) {
    super(parameters);
  }

  analyzeMarket(data: OHLCV[]): 'buy' | 'sell' | 'hold' {
    this.calculateATR(data);
    this.calculateBands(data);
    this.calculateTrend();

    const lastIndex = data.length - 1;
    const currentTrend = this.trend[lastIndex];
    const prevTrend = this.trend[lastIndex - 1];

    if (currentTrend === 'up' && prevTrend === 'down') {
      return 'buy';
    } else if (currentTrend === 'down' && prevTrend === 'up') {
      return 'sell';
    }

    return 'hold';
  }

  private calculateATR(data: OHLCV[]): void {
    const period = this.parameters.atrPeriod || 14;
    this.atr = new Array(data.length).fill(0);

    for (let i = 1; i < data.length; i++) {
      const high = data[i].high;
      const low = data[i].low;
      const prevClose = data[i - 1].close;

      const tr1 = high - low;
      const tr2 = Math.abs(high - prevClose);
      const tr3 = Math.abs(low - prevClose);

      const tr = Math.max(tr1, tr2, tr3);
      this.atr[i] = i < period 
        ? (this.atr[i - 1] * (i - 1) + tr) / i
        : (this.atr[i - 1] * (period - 1) + tr) / period;
    }
  }

  private calculateBands(data: OHLCV[]): void {
    const multiplier = this.parameters.multiplier || 3;
    this.upperBand = new Array(data.length).fill(0);
    this.lowerBand = new Array(data.length).fill(0);

    for (let i = 1; i < data.length; i++) {
      const basicUpper = (data[i].high + data[i].low) / 2 + multiplier * this.atr[i];
      const basicLower = (data[i].high + data[i].low) / 2 - multiplier * this.atr[i];

      this.upperBand[i] = basicUpper < this.upperBand[i - 1] || data[i - 1].close > this.upperBand[i - 1]
        ? basicUpper
        : this.upperBand[i - 1];

      this.lowerBand[i] = basicLower > this.lowerBand[i - 1] || data[i - 1].close < this.lowerBand[i - 1]
        ? basicLower
        : this.lowerBand[i - 1];
    }
  }

  private calculateTrend(): void {
    this.trend = new Array(this.upperBand.length).fill('up');

    for (let i = 1; i < this.upperBand.length; i++) {
      this.trend[i] = this.trend[i - 1] === 'up' && this.lowerBand[i] < this.lowerBand[i - 1]
        ? 'up'
        : this.trend[i - 1] === 'down' && this.upperBand[i] > this.upperBand[i - 1]
          ? 'down'
          : this.trend[i - 1];
    }
  }
} 