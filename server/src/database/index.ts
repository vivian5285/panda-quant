import { Deposit, DepositNotification, LargeDepositAlert } from '../types/deposit';
import { logger } from '../utils/logger';
import { Pool } from 'pg';

export class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || '5432')
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async saveNotification(notification: DepositNotification): Promise<void> {
    try {
      await this.pool.query(
        'INSERT INTO notifications (user_id, type, message, data) VALUES ($1, $2, $3, $4)',
        [notification.userId, notification.type, notification.message, notification.data]
      );
    } catch (error) {
      logger.error('Error saving notification:', error);
      throw error;
    }
  }

  public async getAdmins(): Promise<{ id: string }[]> {
    try {
      const result = await this.pool.query('SELECT id FROM users WHERE is_admin = true');
      return result.rows;
    } catch (error) {
      logger.error('Error getting admins:', error);
      throw error;
    }
  }

  public async recordRiskEvent(event: {
    type: string;
    userId: string;
    amount: number;
    timestamp: Date;
  }): Promise<void> {
    try {
      await this.pool.query(
        'INSERT INTO risk_events (type, user_id, amount, timestamp) VALUES ($1, $2, $3, $4)',
        [event.type, event.userId, event.amount, event.timestamp]
      );
    } catch (error) {
      logger.error('Error recording risk event:', error);
      throw error;
    }
  }

  public async saveDeposit(deposit: Deposit): Promise<void> {
    try {
      await this.pool.query(
        'INSERT INTO deposits (user_id, amount, currency, network, tx_hash, timestamp, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [deposit.userId, deposit.amount, deposit.currency, deposit.network, deposit.txHash, deposit.timestamp, deposit.status]
      );
    } catch (error) {
      logger.error('Error saving deposit:', error);
      throw error;
    }
  }
} 