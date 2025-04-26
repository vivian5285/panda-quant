import { StrategyPreset } from '../config/strategiesConfig';
import { OHLCV, Trade } from '../types';
import { calculateEMA, calculateRSI, calculateVolumeMA } from '../utils/indicators';

export class ScalpingStrategy {
  private params: StrategyPreset;
  private position: 'long' | 'short' | null = null;
  private entryPrice: number | null = null;
  private trades: Trade[] = [];

  constructor(params: StrategyPreset) {
    this.params = params;
  }

  // 分析市场并生成交易信号
  analyzeMarket(candles: OHLCV[]): 'buy' | 'sell' | 'hold' {
    if (candles.length < 20) return 'hold';

    const currentCandle = candles[candles.length - 1];
    const prevCandle = candles[candles.length - 2];

    // 计算技术指标
    const ema20 = calculateEMA(candles, 20);
    const rsi = calculateRSI(candles, 14);
    const volumeMA = calculateVolumeMA(candles, 20);

    // 检查交易条件
    const isTrendUp = currentCandle.close > ema20;
    const isOversold = rsi < 30;
    const isOverbought = rsi > 70;
    const isVolumeHigh = currentCandle.volume > volumeMA * 1.5;

    // 生成交易信号
    if (isTrendUp && isOversold && isVolumeHigh) {
      return 'buy';
    } else if (!isTrendUp && isOverbought && isVolumeHigh) {
      return 'sell';
    }

    return 'hold';
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
          entryTime: Date.now() - 1000 * 60 * 5, // 假设5分钟前入场
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

  // 获取策略统计信息
  getStatistics(): {
    totalProfit: number;
    maxDrawdown: number;
    winRate: number;
    trades: Trade[];
  } {
    const totalProfit = this.trades.reduce((sum, trade) => sum + trade.profit, 0);
    const winningTrades = this.trades.filter(trade => trade.profit > 0).length;
    const winRate = this.trades.length > 0 ? (winningTrades / this.trades.length) * 100 : 0;

    // 计算最大回撤
    let maxDrawdown = 0;
    let peak = 0;
    let current = 0;

    this.trades.forEach(trade => {
      current += trade.profit;
      if (current > peak) {
        peak = current;
      }
      const drawdown = peak - current;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    });

    return {
      totalProfit,
      maxDrawdown,
      winRate,
      trades: this.trades,
    };
  }
} 