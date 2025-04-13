import { Exchange } from 'ccxt';
import { ExchangeConfig } from '../types';

export class ExchangeApi {
  private exchange: Exchange;
  private config: ExchangeConfig;

  constructor(config: ExchangeConfig) {
    this.config = config;
    this.exchange = this.createExchangeInstance();
  }

  private createExchangeInstance(): Exchange {
    const { exchangeName, apiKey, apiSecret } = this.config;
    
    // 根据交易所名称创建对应的实例
    switch (exchangeName.toLowerCase()) {
      case 'binance':
        return new ccxt.binance({ apiKey, apiSecret });
      case 'okx':
        return new ccxt.okx({ apiKey, apiSecret });
      case 'gate':
        return new ccxt.gateio({ apiKey, apiSecret });
      case 'bitget':
        return new ccxt.bitget({ apiKey, apiSecret });
      default:
        throw new Error(`Unsupported exchange: ${exchangeName}`);
    }
  }

  // 获取账户余额
  async getBalance(): Promise<any> {
    try {
      return await this.exchange.fetchBalance();
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }

  // 创建订单
  async createOrder(
    symbol: string,
    type: string,
    side: string,
    amount: number,
    price?: number
  ): Promise<any> {
    try {
      return await this.exchange.createOrder(
        symbol,
        type,
        side,
        amount,
        price
      );
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // 获取订单状态
  async getOrderStatus(orderId: string, symbol: string): Promise<any> {
    try {
      return await this.exchange.fetchOrder(orderId, symbol);
    } catch (error) {
      console.error('Error fetching order status:', error);
      throw error;
    }
  }

  // 取消订单
  async cancelOrder(orderId: string, symbol: string): Promise<any> {
    try {
      return await this.exchange.cancelOrder(orderId, symbol);
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  }

  // 获取K线数据
  async getOHLCV(
    symbol: string,
    timeframe: string,
    since?: number,
    limit?: number
  ): Promise<any[]> {
    try {
      return await this.exchange.fetchOHLCV(
        symbol,
        timeframe,
        since,
        limit
      );
    } catch (error) {
      console.error('Error fetching OHLCV data:', error);
      throw error;
    }
  }

  // 获取交易对信息
  async getMarketInfo(symbol: string): Promise<any> {
    try {
      return await this.exchange.fetchMarket(symbol);
    } catch (error) {
      console.error('Error fetching market info:', error);
      throw error;
    }
  }

  // 获取当前价格
  async getCurrentPrice(symbol: string): Promise<number> {
    try {
      const ticker = await this.exchange.fetchTicker(symbol);
      return ticker.last;
    } catch (error) {
      console.error('Error fetching current price:', error);
      throw error;
    }
  }
} 