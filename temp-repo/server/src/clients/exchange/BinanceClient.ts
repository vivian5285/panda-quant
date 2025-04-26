import { BaseExchangeClient } from './BaseExchangeClient';
import { ExchangeCredentials, ExchangeBalance, ExchangeOrder, ExchangePosition, ExchangeTrade, ExchangeMarketData } from '../../interfaces/exchange';
import axios from 'axios';
import crypto from 'crypto';

export class BinanceClient extends BaseExchangeClient {
  private baseUrl: string;
  private wsUrl: string;

  constructor(credentials: ExchangeCredentials, isTestnet: boolean = false) {
    super('binance', credentials);
    this.baseUrl = isTestnet ? 'https://testnet.binance.vision' : 'https://api.binance.com';
    this.wsUrl = isTestnet ? 'wss://testnet.binance.vision' : 'wss://stream.binance.com:9443';
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

  async getBalance(): Promise<ExchangeBalance[]> {
    const data = await this.request('GET', '/api/v3/account', {}, true);
    return data.balances.map((balance: any) => ({
      currency: balance.asset,
      available: parseFloat(balance.free),
      frozen: parseFloat(balance.locked),
      total: parseFloat(balance.free) + parseFloat(balance.locked),
    }));
  }

  async getOrder(orderId: string): Promise<ExchangeOrder> {
    const data = await this.request('GET', '/api/v3/order', { orderId }, true);
    return this.parseOrder(data);
  }

  async getOrders(symbol?: string): Promise<ExchangeOrder[]> {
    const params: any = {};
    if (symbol) params.symbol = symbol;
    const data = await this.request('GET', '/api/v3/openOrders', params, true);
    return data.map(this.parseOrder);
  }

  async createOrder(symbol: string, type: 'market' | 'limit', side: 'buy' | 'sell', amount: number, price?: number): Promise<ExchangeOrder> {
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

  async getPositions(symbol?: string): Promise<ExchangePosition[]> {
    const data = await this.request('GET', '/fapi/v2/positionRisk', {}, true);
    let positions = data.map(this.parsePosition);
    if (symbol) {
      positions = positions.filter((p: ExchangePosition) => p.symbol === symbol);
    }
    return positions;
  }

  async getTrades(symbol?: string, startTime?: Date, endTime?: Date): Promise<ExchangeTrade[]> {
    const params: any = {};
    if (symbol) params.symbol = symbol;
    if (startTime) params.startTime = startTime.getTime();
    if (endTime) params.endTime = endTime.getTime();
    
    const data = await this.request('GET', '/api/v3/myTrades', params, true);
    return data.map(this.parseTrade);
  }

  async getMarketData(symbol: string): Promise<ExchangeMarketData> {
    const data = await this.request('GET', '/api/v3/ticker/24hr', { symbol });
    return this.parseMarketData(data);
  }

  async getMarketDataList(symbols: string[]): Promise<ExchangeMarketData[]> {
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
    const data = await this.request('GET', '/api/v3/account', {}, true);
    const feeTier = data.feeTier;
    const feeData = await this.request('GET', '/api/v3/asset/tradeFee', { symbol }, true);
    return parseFloat(feeData[0].takerCommission);
  }

  private parseOrder(data: any): ExchangeOrder {
    return {
      id: data.orderId.toString(),
      symbol: data.symbol,
      type: data.type.toLowerCase(),
      side: data.side.toLowerCase(),
      price: parseFloat(data.price),
      amount: parseFloat(data.origQty),
      status: data.status.toLowerCase(),
      createdAt: new Date(data.time),
      updatedAt: new Date(data.updateTime),
    };
  }

  private parsePosition(data: any): ExchangePosition {
    return {
      symbol: data.symbol,
      side: parseFloat(data.positionAmt) > 0 ? 'long' : 'short',
      amount: Math.abs(parseFloat(data.positionAmt)),
      entryPrice: parseFloat(data.entryPrice),
      leverage: parseFloat(data.leverage),
      liquidationPrice: parseFloat(data.liquidationPrice),
      margin: parseFloat(data.marginType === 'isolated' ? data.isolatedMargin : data.marginBalance),
      unrealizedPnl: parseFloat(data.unRealizedProfit),
      realizedPnl: parseFloat(data.realizedProfit),
    };
  }

  private parseTrade(data: any): ExchangeTrade {
    return {
      id: data.id.toString(),
      symbol: data.symbol,
      side: data.isBuyer ? 'buy' : 'sell',
      price: parseFloat(data.price),
      amount: parseFloat(data.qty),
      fee: parseFloat(data.commission),
      feeCurrency: data.commissionAsset,
      timestamp: new Date(data.time),
    };
  }

  private parseMarketData(data: any): ExchangeMarketData {
    return {
      symbol: data.symbol,
      bid: parseFloat(data.bidPrice),
      ask: parseFloat(data.askPrice),
      last: parseFloat(data.lastPrice),
      volume: parseFloat(data.volume),
      timestamp: new Date(data.closeTime),
    };
  }
} 