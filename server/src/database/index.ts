import { IDeposit } from '../types/deposit';
import { logger } from '../utils/logger';
import { Pool } from 'pg';
import { DepositNotification } from '../models/depositNotification';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432')
});

export const database = {
  async createDeposit(deposit: IDeposit) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const result = await client.query(
        'INSERT INTO deposits (user_id, amount, status, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
        [deposit.userId, deposit.amount, deposit.status, deposit.createdAt]
      );

      const notification = new DepositNotification({
        type: 'deposit',
        message: `New deposit of ${deposit.amount}`,
        data: deposit
      });

      await notification.save();
      
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async saveNotification(notification: DepositNotification): Promise<void> {
    try {
      await pool.query(
        'INSERT INTO notifications (user_id, type, message, data) VALUES ($1, $2, $3, $4)',
        [notification.userId, notification.type, notification.message, notification.data]
      );
    } catch (error) {
      logger.error('Error saving notification:', error);
      throw error;
    }
  },

  async getAdmins(): Promise<{ id: string }[]> {
    try {
      const result = await pool.query('SELECT id FROM users WHERE is_admin = true');
      return result.rows;
    } catch (error) {
      logger.error('Error getting admins:', error);
      throw error;
    }
  },

  async recordRiskEvent(event: {
    type: string;
    userId: string;
    amount: number;
    timestamp: Date;
  }): Promise<void> {
    try {
      await pool.query(
        'INSERT INTO risk_events (type, user_id, amount, timestamp) VALUES ($1, $2, $3, $4)',
        [event.type, event.userId, event.amount, event.timestamp]
      );
    } catch (error) {
      logger.error('Error recording risk event:', error);
      throw error;
    }
  },

  async saveDeposit(deposit: IDeposit): Promise<void> {
    try {
      await pool.query(
        'INSERT INTO deposits (user_id, amount, currency, network, tx_hash, timestamp, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [deposit.userId, deposit.amount, deposit.currency, deposit.network, deposit.txHash, deposit.timestamp, deposit.status]
      );
    } catch (error) {
      logger.error('Error saving deposit:', error);
      throw error;
    }
  }
}; 