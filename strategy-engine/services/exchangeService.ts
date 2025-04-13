import { OHLCV } from '../types';
import axios from 'axios';
import config from '../config';

export class ExchangeService {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.EXCHANGE_API_KEY || '';
    this.apiSecret = process.env.EXCHANGE_API_SECRET || '';
    this.baseUrl = process.env.EXCHANGE_API_URL || 'https://api.exchange.com';
  }

  public async getMarketData(symbol: string, timeframe: string): Promise<OHLCV[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/market/kline`, {
        params: {
          symbol,
          interval: timeframe,
          limit: 1000
        },
        headers: {
          'X-MBX-APIKEY': this.apiKey
        }
      });

      return response.data.map((item: any) => ({
        timestamp: item[0],
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        volume: parseFloat(item[5])
      }));
    } catch (error) {
      console.error('获取市场数据失败:', error);
      throw error;
    }
  }

  public async getAccountBalance(): Promise<Record<string, number>> {
    try {
      const timestamp = Date.now();
      const signature = this.generateSignature(timestamp);

      const response = await axios.get(`${this.baseUrl}/account/balance`, {
        headers: {
          'X-MBX-APIKEY': this.apiKey,
          'X-MBX-SIGNATURE': signature,
          'X-MBX-TIMESTAMP': timestamp
        }
      });

      return response.data.balances.reduce((acc: Record<string, number>, balance: any) => {
        acc[balance.asset] = parseFloat(balance.free);
        return acc;
      }, {});
    } catch (error) {
      console.error('获取账户余额失败:', error);
      throw error;
    }
  }

  public async placeOrder(
    symbol: string,
    side: 'BUY' | 'SELL',
    type: 'LIMIT' | 'MARKET',
    quantity: number,
    price?: number
  ): Promise<string> {
    try {
      const timestamp = Date.now();
      const params = {
        symbol,
        side,
        type,
        quantity,
        price,
        timestamp
      };
      const signature = this.generateSignature(JSON.stringify(params));

      const response = await axios.post(`${this.baseUrl}/order`, params, {
        headers: {
          'X-MBX-APIKEY': this.apiKey,
          'X-MBX-SIGNATURE': signature,
          'X-MBX-TIMESTAMP': timestamp
        }
      });

      return response.data.orderId;
    } catch (error) {
      console.error('下单失败:', error);
      throw error;
    }
  }

  public async cancelOrder(symbol: string, orderId: string): Promise<void> {
    try {
      const timestamp = Date.now();
      const params = {
        symbol,
        orderId,
        timestamp
      };
      const signature = this.generateSignature(JSON.stringify(params));

      await axios.delete(`${this.baseUrl}/order`, {
        params,
        headers: {
          'X-MBX-APIKEY': this.apiKey,
          'X-MBX-SIGNATURE': signature,
          'X-MBX-TIMESTAMP': timestamp
        }
      });
    } catch (error) {
      console.error('取消订单失败:', error);
      throw error;
    }
  }

  private generateSignature(data: string): string {
    // 实现签名生成逻辑
    return '';
  }
} 