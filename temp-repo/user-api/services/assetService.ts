import { DatabaseService } from './databaseService';

export class AssetService {
  private static instance: AssetService;

  private constructor() {}

  public static getInstance(): AssetService {
    if (!AssetService.instance) {
      AssetService.instance = new AssetService();
    }
    return AssetService.instance;
  }

  public async getUserBalance(userId: number): Promise<number> {
    try {
      const result = await DatabaseService.query(
        'SELECT balance FROM user_balances WHERE user_id = $1',
        [userId]
      );

      if (!result.rows.length) {
        return 0;
      }

      return parseFloat(result.rows[0].balance);
    } catch (error) {
      console.error('Error getting user balance:', error);
      throw error;
    }
  }

  public async addBalance(userId: number, amount: number): Promise<void> {
    try {
      await DatabaseService.query(
        `INSERT INTO user_balances (user_id, balance)
         VALUES ($1, $2)
         ON CONFLICT (user_id) 
         DO UPDATE SET balance = user_balances.balance + $2`,
        [userId, amount]
      );
    } catch (error) {
      console.error('Error adding balance:', error);
      throw error;
    }
  }

  public async deductBalance(userId: number, amount: number): Promise<void> {
    try {
      const currentBalance = await this.getUserBalance(userId);
      if (currentBalance < amount) {
        throw new Error('Insufficient balance');
      }

      await DatabaseService.query(
        `UPDATE user_balances 
         SET balance = balance - $1 
         WHERE user_id = $2`,
        [amount, userId]
      );
    } catch (error) {
      console.error('Error deducting balance:', error);
      throw error;
    }
  }

  public async freezeBalance(userId: number, amount: number): Promise<void> {
    try {
      const currentBalance = await this.getUserBalance(userId);
      if (currentBalance < amount) {
        throw new Error('Insufficient balance');
      }

      await DatabaseService.query(
        `UPDATE user_balances 
         SET balance = balance - $1,
             frozen_balance = frozen_balance + $1 
         WHERE user_id = $2`,
        [amount, userId]
      );
    } catch (error) {
      console.error('Error freezing balance:', error);
      throw error;
    }
  }

  public async unfreezeBalance(userId: number, amount: number): Promise<void> {
    try {
      await DatabaseService.query(
        `UPDATE user_balances 
         SET balance = balance + $1,
             frozen_balance = frozen_balance - $1 
         WHERE user_id = $2`,
        [amount, userId]
      );
    } catch (error) {
      console.error('Error unfreezing balance:', error);
      throw error;
    }
  }

  public async getFrozenBalance(userId: number): Promise<number> {
    try {
      const result = await DatabaseService.query(
        'SELECT frozen_balance FROM user_balances WHERE user_id = $1',
        [userId]
      );

      if (!result.rows.length) {
        return 0;
      }

      return parseFloat(result.rows[0].frozen_balance);
    } catch (error) {
      console.error('Error getting frozen balance:', error);
      throw error;
    }
  }

  public async getTotalBalance(userId: number): Promise<number> {
    try {
      const result = await DatabaseService.query(
        'SELECT balance + frozen_balance as total_balance FROM user_balances WHERE user_id = $1',
        [userId]
      );

      if (!result.rows.length) {
        return 0;
      }

      return parseFloat(result.rows[0].total_balance);
    } catch (error) {
      console.error('Error getting total balance:', error);
      throw error;
    }
  }
} 