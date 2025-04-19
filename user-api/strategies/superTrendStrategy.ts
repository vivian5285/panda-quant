import { Strategy } from './types';
import { OHLCV } from './types';

export class SuperTrendStrategy implements Strategy {
  private atr: number[] = [];
  private upperBand: number[] = [];
  private lowerBand: number[] = [];
  private trend: ('up' | 'down')[] = [];
  public id: string;
  public name: string;
  public description: string;
  public riskLevel: 'high' | 'medium' | 'low';
  public expectedReturn: number;
  public active: boolean;
  public parameters: { [key: string]: any };

  constructor(parameters: Record<string, number>) {
    this.id = Math.random().toString(36).substring(2, 15);
    this.name = 'SuperTrend';
    this.description = 'SuperTrend trading strategy';
    this.riskLevel = 'medium';
    this.expectedReturn = 10;
    this.active = true;
    this.parameters = parameters;
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

  updateParams(params: { [key: string]: any }): void {
    this.parameters = { ...this.parameters, ...params };
  }

  getStats(): any {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      riskLevel: this.riskLevel,
      expectedReturn: this.expectedReturn,
      active: this.active,
      parameters: this.parameters
    };
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
      const basicUpperBand = (data[i].high + data[i].low) / 2 + multiplier * this.atr[i];
      const basicLowerBand = (data[i].high + data[i].low) / 2 - multiplier * this.atr[i];

      this.upperBand[i] = basicUpperBand;
      this.lowerBand[i] = basicLowerBand;
    }
  }

  private calculateTrend(): void {
    this.trend = new Array(this.upperBand.length).fill('up');

    for (let i = 1; i < this.upperBand.length; i++) {
      if (this.upperBand[i] < this.upperBand[i - 1]) {
        this.trend[i] = 'down';
      }
    }
  }
} 