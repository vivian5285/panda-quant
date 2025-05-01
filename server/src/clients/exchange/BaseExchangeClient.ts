import { IExchangeCredentials, IExchangeBalance, IExchangeOrder, IExchangePosition, IExchangeTrade, IExchangeMarketData } from '../../types/exchange';

export abstract class BaseExchangeClient {
  protected credentials: IExchangeCredentials;
  protected exchange: string;

  constructor(exchange: string, credentials: IExchangeCredentials) {
    this.exchange = exchange;
    this.credentials = credentials;
  }

  // 获取账户余额
  abstract getBalance(): Promise<IExchangeBalance[]>;

  // 获取订单
  abstract getOrder(orderId: string): Promise<IExchangeOrder>;
  abstract getOrders(symbol?: string): Promise<IExchangeOrder[]>;

  // 创建订单
  abstract createOrder(symbol: string, type: 'market' | 'limit', side: 'buy' | 'sell', amount: number, price?: number): Promise<IExchangeOrder>;

  // 取消订单
  abstract cancelOrder(orderId: string): Promise<void>;
  abstract cancelOrders(symbol?: string): Promise<void>;

  // 获取持仓
  abstract getPositions(symbol?: string): Promise<IExchangePosition[]>;

  // 获取交易历史
  abstract getTrades(symbol?: string, startTime?: Date, endTime?: Date): Promise<IExchangeTrade[]>;

  // 获取市场数据
  abstract getMarketData(symbol: string): Promise<IExchangeMarketData>;
  abstract getMarketDataList(symbols: string[]): Promise<IExchangeMarketData[]>;

  // 获取K线数据
  abstract getKlines(symbol: string, interval: string, startTime?: Date, endTime?: Date): Promise<any[]>;

  // 获取交易对信息
  abstract getSymbols(): Promise<string[]>;

  // 获取杠杆
  abstract getLeverage(symbol: string): Promise<number>;
  abstract setLeverage(symbol: string, leverage: number): Promise<void>;

  // 获取手续费率
  abstract getFeeRate(symbol: string): Promise<number>;
} 