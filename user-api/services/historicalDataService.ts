import { OHLCV } from '../../strategy-engine/types';
import { DatabaseService } from './databaseService';
import axios from 'axios';

export class HistoricalDataService {
  // 获取历史数据
  static async getHistoricalData(
    symbol: string,
    timeframe: string,
    startDate: Date,
    endDate: Date
  ): Promise<OHLCV[]> {
    try {
      // 首先尝试从数据库获取
      let data = await this.getFromDatabase(symbol, timeframe, startDate, endDate);
      
      // 如果数据库中没有足够的数据，从外部API获取
      if (data.length === 0) {
        data = await this.fetchFromExternalAPI(symbol, timeframe, startDate, endDate);
        
        // 将获取的数据保存到数据库
        await this.saveToDatabase(symbol, timeframe, data);
      }
      
      return data;
    } catch (error) {
      console.error('Error in getHistoricalData:', error);
      throw error;
    }
  }

  // 从数据库获取历史数据
  private static async getFromDatabase(
    symbol: string,
    timeframe: string,
    startDate: Date,
    endDate: Date
  ): Promise<OHLCV[]> {
    try {
      const query = `
        SELECT * FROM historical_data 
        WHERE symbol = $1 
        AND timeframe = $2 
        AND timestamp BETWEEN $3 AND $4 
        ORDER BY timestamp ASC
      `;
      
      const result = await DatabaseService.query(query, [
        symbol,
        timeframe,
        startDate,
        endDate
      ]);
      
      return result.rows.map(row => ({
        timestamp: row.timestamp,
        open: row.open,
        high: row.high,
        low: row.low,
        close: row.close,
        volume: row.volume
      }));
    } catch (error) {
      console.error('Error in getFromDatabase:', error);
      return [];
    }
  }

  // 从外部API获取历史数据
  private static async fetchFromExternalAPI(
    symbol: string,
    timeframe: string,
    startDate: Date,
    endDate: Date
  ): Promise<OHLCV[]> {
    try {
      // 这里使用Binance API作为示例
      const response = await axios.get('https://api.binance.com/api/v3/klines', {
        params: {
          symbol: symbol.replace('/', ''),
          interval: this.convertTimeframe(timeframe),
          startTime: startDate.getTime(),
          endTime: endDate.getTime(),
          limit: 1000
        }
      });

      return response.data.map((kline: any[]) => ({
        timestamp: kline[0],
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4]),
        volume: parseFloat(kline[5])
      }));
    } catch (error) {
      console.error('Error in fetchFromExternalAPI:', error);
      throw error;
    }
  }

  // 保存历史数据到数据库
  private static async saveToDatabase(
    symbol: string,
    timeframe: string,
    data: OHLCV[]
  ): Promise<void> {
    try {
      const query = `
        INSERT INTO historical_data 
        (symbol, timeframe, timestamp, open, high, low, close, volume)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (symbol, timeframe, timestamp) DO NOTHING
      `;

      for (const item of data) {
        await DatabaseService.query(query, [
          symbol,
          timeframe,
          item.timestamp,
          item.open,
          item.high,
          item.low,
          item.close,
          item.volume
        ]);
      }
    } catch (error) {
      console.error('Error in saveToDatabase:', error);
      throw error;
    }
  }

  // 转换时间周期格式
  private static convertTimeframe(timeframe: string): string {
    const mapping: Record<string, string> = {
      '1m': '1m',
      '5m': '5m',
      '15m': '15m',
      '1h': '1h',
      '4h': '4h',
      '1d': '1d'
    };
    return mapping[timeframe] || '1h';
  }

  // 清理旧数据
  static async cleanupOldData(daysToKeep: number = 30): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const query = `
        DELETE FROM historical_data 
        WHERE timestamp < $1
      `;

      await DatabaseService.query(query, [cutoffDate]);
    } catch (error) {
      console.error('Error in cleanupOldData:', error);
      throw error;
    }
  }
} 