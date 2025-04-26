import { StrategyPreset } from '../config/strategiesConfig';
import { OHLCV, Trade } from '../types';
import { calculateEMA } from '../utils/indicators';

export class GridStrategy {
  private params: StrategyPreset;
  private positions: {
    price: number;
    amount: number;
    type: 'long' | 'short';
  }[] = [];
  private trades: Trade[] = [];
  private basePrice: number | null = null;
  private gridLevels: number[] = [];

  constructor(params: StrategyPreset) {
    this.params = params;
  }

  // 初始化网格
  initializeGrid(basePrice: number) {
    this.basePrice = basePrice;
    this.gridLevels = this.calculateGridLevels(basePrice);
    this.positions = [];
  }

  // 计算网格价格水平
  private calculateGridLevels(basePrice: number): number[] {
    const levels: number[] = [];
    const gridSize = this.params.gridSize!;
    const gridCount = this.params.gridCount!;

    // 计算向上和向下的网格价格
    for (let i = 1; i <= gridCount; i++) {
      const upPrice = basePrice * (1 + (gridSize * i) / 100);
      const downPrice = basePrice * (1 - (gridSize * i) / 100);
      levels.push(upPrice, downPrice);
    }

    return levels.sort((a, b) => a - b);
  }

  // 分析市场并生成交易信号
  analyzeMarket(candles: OHLCV[]): 'buy' | 'sell' | 'hold' {
    if (candles.length < this.params.emaPeriod! + 1) return 'hold';

    // 计算EMA
    const ema = calculateEMA(candles, this.params.emaPeriod!);
    const currentPrice = candles[candles.length - 1].close;
    const currentEMA = ema[ema.length - 1];

    // 检查是否在网格范围内
    if (!this.isInGridRange(currentPrice)) {
      return 'hold';
    }

    // 根据EMA和价格关系生成信号
    if (currentPrice < currentEMA) {
      return 'buy';
    } else if (currentPrice > currentEMA) {
      return 'sell';
    }

    return 'hold';
  }

  // 检查价格是否在网格范围内
  private isInGridRange(price: number): boolean {
    if (!this.basePrice) return false;

    const maxDeviation = this.params.gridSize! * this.params.gridCount! / 100;
    const minPrice = this.basePrice * (1 - maxDeviation);
    const maxPrice = this.basePrice * (1 + maxDeviation);

    return price >= minPrice && price <= maxPrice;
  }

  // 执行交易
  executeTrade(signal: 'buy' | 'sell', currentPrice: number): Trade | null {
    if (!this.basePrice) {
      this.initializeGrid(currentPrice);
      return null;
    }

    // 检查是否需要平仓
    const positionToClose = this.findPositionToClose(currentPrice);
    if (positionToClose) {
      const profit = this.calculateProfit(positionToClose, currentPrice);
      const trade: Trade = {
        id: Date.now().toString(),
        symbol: 'BTC/USDT',
        entryPrice: positionToClose.price,
        exitPrice: currentPrice,
        amount: positionToClose.amount,
        profit,
        entryTime: Date.now() - 1000 * 60 * 15, // 假设15分钟前入场
        exitTime: Date.now(),
        type: positionToClose.type,
      };

      this.trades.push(trade);
      this.positions = this.positions.filter(p => p !== positionToClose);
      return trade;
    }

    // 开新仓
    if (signal === 'buy' || signal === 'sell') {
      const positionAmount = this.params.positionSize! / this.params.gridCount!;
      const position = {
        price: currentPrice,
        amount: positionAmount,
        type: signal === 'buy' ? 'long' : 'short',
      };

      this.positions.push(position);
    }

    return null;
  }

  // 查找需要平仓的仓位
  private findPositionToClose(currentPrice: number) {
    return this.positions.find(position => {
      const priceDiff = Math.abs(currentPrice - position.price);
      const priceDiffPercent = (priceDiff / position.price) * 100;

      // 检查是否达到止盈或止损条件
      if (priceDiffPercent >= this.params.takeProfit!) {
        return true;
      }

      // 检查是否达到网格平仓条件
      const gridSize = this.params.gridSize!;
      if (priceDiffPercent >= gridSize) {
        return true;
      }

      return false;
    });
  }

  // 计算利润
  private calculateProfit(position: { price: number; amount: number; type: 'long' | 'short' }, currentPrice: number): number {
    const priceDiff = position.type === 'long' 
      ? currentPrice - position.price 
      : position.price - currentPrice;

    return priceDiff * position.amount;
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