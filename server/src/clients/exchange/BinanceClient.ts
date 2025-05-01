import { BaseExchangeClient } from './BaseExchangeClient';
import { IExchangeCredentials, IExchangeBalance, IExchangeOrder, IExchangePosition, IExchangeTrade, IExchangeMarketData } from '../../types/exchange';
import axios from 'axios';
import crypto from 'crypto';
import { logger } from '../../utils/logger';

export class BinanceClient extends BaseExchangeClient {
  private baseUrl: string;

  constructor(credentials: IExchangeCredentials, isTestnet: boolean = false) {
    super('binance', credentials);
    this.baseUrl = isTestnet ? 'https://testnet.binance.vision' : 'https://api.binance.com';
  }

  private async request(method: string, endpoint: string, params: any = {}, isPrivate: boolean = false) {
    const url = `${this.baseUrl}${endpoint}`;
    const timestamp = Date.now();
    
    if (isPrivate) {
      params.timestamp = timestamp;
      const queryString = new URLSearchParams(params).toString();
      const signature = crypto
        .createHmac('sha256', this.credentials.apiSecret)
        .update(queryString)
        .digest('hex');
      params.signature = signature;
    }

    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (isPrivate) {
      headers['X-MBX-APIKEY'] = this.credentials.apiKey;
    }

    const response = await axios({
      method,
      url,
      params,
      headers,
    });

    return response.data;
  }

  async getBalance(): Promise<IExchangeBalance[]> {
    const data = await this.request('GET', '/api/v3/account', {}, true);
    return data.balances.map((balance: any) => ({
      currency: balance.asset,
      available: parseFloat(balance.free),
      frozen: parseFloat(balance.locked),
      total: parseFloat(balance.free) + parseFloat(balance.locked),
    }));
  }

  async getOrder(orderId: string): Promise<IExchangeOrder> {
    const data = await this.request('GET', '/api/v3/order', { orderId }, true);
    return this.parseOrder(data);
  }

  async getOrders(symbol?: string): Promise<IExchangeOrder[]> {
    const params: any = {};
    if (symbol) params.symbol = symbol;
    const data = await this.request('GET', '/api/v3/openOrders', params, true);
    return data.map(this.parseOrder);
  }

  async createOrder(symbol: string, type: 'market' | 'limit', side: 'buy' | 'sell', amount: number, price?: number): Promise<IExchangeOrder> {
    const params: any = {
      symbol,
      side: side.toUpperCase(),
      type: type.toUpperCase(),
      quantity: amount,
    };

    if (type === 'limit') {
      params.price = price;
      params.timeInForce = 'GTC';
    }

    const data = await this.request('POST', '/api/v3/order', params, true);
    return this.parseOrder(data);
  }

  async cancelOrder(orderId: string): Promise<void> {
    await this.request('DELETE', '/api/v3/order', { orderId }, true);
  }

  async cancelOrders(symbol?: string): Promise<void> {
    if (!symbol) throw new Error('Symbol is required for canceling all orders');
    await this.request('DELETE', '/api/v3/openOrders', { symbol }, true);
  }

  async getPositions(symbol?: string): Promise<IExchangePosition[]> {
    const data = await this.request('GET', '/fapi/v2/positionRisk', {}, true);
    let positions = data.map(this.parsePosition);
    if (symbol) {
      positions = positions.filter((p: IExchangePosition) => p.symbol === symbol);
    }
    return positions;
  }

  async getTrades(symbol?: string, startTime?: Date, endTime?: Date): Promise<IExchangeTrade[]> {
    const params: any = {};
    if (symbol) params.symbol = symbol;
    if (startTime) params.startTime = startTime.getTime();
    if (endTime) params.endTime = endTime.getTime();
    
    const data = await this.request('GET', '/api/v3/myTrades', params, true);
    return data.map(this.parseTrade);
  }

  async getMarketData(symbol: string): Promise<IExchangeMarketData> {
    const data = await this.request('GET', '/api/v3/ticker/24hr', { symbol });
    return this.parseMarketData(data);
  }

  async getMarketDataList(symbols: string[]): Promise<IExchangeMarketData[]> {
    const data = await this.request('GET', '/api/v3/ticker/24hr');
    return data
      .filter((item: any) => symbols.includes(item.symbol))
      .map(this.parseMarketData);
  }

  async getKlines(symbol: string, interval: string, startTime?: Date, endTime?: Date): Promise<any[]> {
    const params: any = { symbol, interval };
    if (startTime) params.startTime = startTime.getTime();
    if (endTime) params.endTime = endTime.getTime();
    
    return await this.request('GET', '/api/v3/klines', params);
  }

  async getSymbols(): Promise<string[]> {
    const data = await this.request('GET', '/api/v3/exchangeInfo');
    return data.symbols.map((s: any) => s.symbol);
  }

  async getLeverage(symbol: string): Promise<number> {
    const data = await this.request('GET', '/fapi/v2/leverageBracket', { symbol }, true);
    return data[0].brackets[0].initialLeverage;
  }

  async setLeverage(symbol: string, leverage: number): Promise<void> {
    await this.request('POST', '/fapi/v1/leverage', { symbol, leverage }, true);
  }

  async getFeeRate(symbol: string): Promise<number> {
    await this.request('GET', '/api/v3/account', {}, true);
    const feeData = await this.request('GET', '/api/v3/asset/tradeFee', { symbol }, true);
    return parseFloat(feeData[0].takerCommission);
  }

  async getAccountInfo(): Promise<any> {
    try {
      const response = await this.request('GET', '/api/v3/account', {}, true);
      return response.data;
    } catch (error) {
      logger.error('Error getting account info:', error);
      throw error;
    }
  }

  private parseOrder(data: any): IExchangeOrder {
    return {
      id: data.orderId.toString(),
      symbol: data.symbol,
      type: data.type.toLowerCase(),
      side: data.side.toLowerCase(),
      price: parseFloat(data.price),
      amount: parseFloat(data.origQty),
      status: data.status.toLowerCase(),
      filled: parseFloat(data.executedQty),
      remaining: parseFloat(data.origQty) - parseFloat(data.executedQty),
      cost: parseFloat(data.cummulativeQuoteQty),
      timestamp: new Date(data.time),
      createdAt: new Date(data.time),
      updatedAt: new Date(data.updateTime || data.time)
    };
  }

  private parsePosition(data: any): IExchangePosition {
    return {
      symbol: data.symbol,
      size: Math.abs(parseFloat(data.positionAmt)),
      side: parseFloat(data.positionAmt) > 0 ? 'long' : 'short',
      entryPrice: parseFloat(data.entryPrice),
      markPrice: parseFloat(data.markPrice),
      unrealizedPnl: parseFloat(data.unRealizedProfit),
      liquidationPrice: parseFloat(data.liquidationPrice),
      leverage: parseFloat(data.leverage),
      marginType: data.marginType.toLowerCase(),
      timestamp: new Date(),
      amount: parseFloat(data.positionAmt),
      margin: parseFloat(data.marginBalance),
      realizedPnl: parseFloat(data.realizedProfit || 0)
    };
  }

  private parseTrade(data: any): IExchangeTrade {
    return {
      id: data.id.toString(),
      symbol: data.symbol,
      orderId: data.orderId.toString(),
      price: parseFloat(data.price),
      amount: parseFloat(data.qty),
      cost: parseFloat(data.quoteQty),
      fee: {
        cost: parseFloat(data.commission),
        currency: data.commissionAsset
      },
      side: data.isBuyer ? 'buy' : 'sell',
      timestamp: new Date(data.time),
      feeCurrency: data.commissionAsset
    };
  }

  private parseMarketData(data: any): IExchangeMarketData {
    return {
      symbol: data.symbol,
      timestamp: new Date(data.closeTime),
      open: parseFloat(data.openPrice),
      high: parseFloat(data.highPrice),
      low: parseFloat(data.lowPrice),
      close: parseFloat(data.lastPrice),
      volume: parseFloat(data.volume),
      quoteVolume: parseFloat(data.quoteVolume),
      trades: data.count,
      bid: parseFloat(data.bidPrice),
      ask: parseFloat(data.askPrice),
      last: parseFloat(data.lastPrice)
    };
  }
} 