import { Pool } from 'pg';

export class DatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'panda_quant',
      password: process.env.DB_PASSWORD || 'postgres',
      port: parseInt(process.env.DB_PORT || '5432'),
    });
  }

  async query(text: string, params?: any[]) {
    try {
      const result = await this.pool.query(text, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async logTrade(trade: any) {
    try {
      await this.query(
        `INSERT INTO trades (
          id, user_id, strategy_id, type, price, amount, profit, timestamp
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          trade.id,
          trade.userId,
          trade.strategyId,
          trade.type,
          trade.price,
          trade.amount,
          trade.profit,
          new Date(trade.timestamp)
        ]
      );
    } catch (error) {
      console.error('Error logging trade:', error);
      throw error;
    }
  }
} 