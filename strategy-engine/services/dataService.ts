import { OHLCV } from '../types';
import { DatabaseService } from '../../user-api/services/databaseService';
import { ExchangeService } from './exchangeService';

export class DataService {
  private databaseService: DatabaseService;
  private exchangeService: ExchangeService;

  constructor() {
    this.databaseService = new DatabaseService();
    this.exchangeService = new ExchangeService();
  }

  public async getHistoricalData(
    symbol: string,
    timeframe: string,
    startTime: number,
    endTime: number
  ): Promise<OHLCV[]> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM historical_data WHERE timestamp >= $1 AND timestamp <= $2 ORDER BY timestamp ASC',
        [startTime, endTime]
      );
      return result.rows;
    } catch (error) {
      console.error('获取历史数据失败:', error);
      throw error;
    }
  }

  public async getMarketData(symbol: string, timeframe: string): Promise<OHLCV[]> {
    try {
      // 从交易所获取实时数据
      const marketData = await this.exchangeService.getMarketData(symbol, timeframe);
      
      // 保存到数据库
      for (const data of marketData) {
        await this.databaseService.query(
          'INSERT INTO historical_data (timestamp, open, high, low, close, volume) VALUES ($1, $2, $3, $4, $5, $6)',
          [data.timestamp, data.open, data.high, data.low, data.close, data.volume]
        );
      }

      return marketData;
    } catch (error) {
      console.error('获取市场数据失败:', error);
      throw error;
    }
  }

  public async getLatestData(symbol: string, timeframe: string, limit: number = 100): Promise<OHLCV[]> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM historical_data WHERE symbol = $1 AND timeframe = $2 ORDER BY timestamp DESC LIMIT $3',
        [symbol, timeframe, limit]
      );
      return result.rows.reverse();
    } catch (error) {
      console.error('获取最新数据失败:', error);
      throw error;
    }
  }
} 