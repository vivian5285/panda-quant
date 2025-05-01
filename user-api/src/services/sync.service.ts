import { Deposit } from '../models/deposit';
import axios from 'axios';
import { Transaction } from '../models/transaction.model';
import { User } from '../models/User';

export class SyncService {
  private adminApiUrl: string;
  private pollingInterval: number;
  private lastDepositSync: Date;
  private lastUserSync: Date;

  constructor() {
    this.adminApiUrl = process.env.ADMIN_API_URL || 'http://localhost:3001/api';
    this.pollingInterval = 5000; // 5 seconds
    this.lastDepositSync = new Date();
    this.lastUserSync = new Date();
  }

  async startSync() {
    try {
      // 启动轮询
      setInterval(() => this.pollDeposits(), this.pollingInterval);
      setInterval(() => this.pollUsers(), this.pollingInterval);

      console.log('Sync service started successfully');
    } catch (error) {
      console.error('Failed to start sync service:', error);
      // 重试机制
      setTimeout(() => this.startSync(), 5000);
    }
  }

  private async pollDeposits() {
    try {
      const deposits = await Deposit.find({
        updatedAt: { $gt: this.lastDepositSync }
      });

      for (const deposit of deposits) {
        await this.syncDepositToAdmin(deposit, 'update');
      }

      this.lastDepositSync = new Date();
    } catch (error) {
      console.error('Error polling deposits:', error);
    }
  }

  private async pollUsers() {
    try {
      const users = await User.find({
        updatedAt: { $gt: this.lastUserSync }
      });

      for (const user of users) {
        await this.syncUserToAdmin(user, 'update');
      }

      this.lastUserSync = new Date();
    } catch (error) {
      console.error('Error polling users:', error);
    }
  }

  private async syncDepositToAdmin(deposit: any, operation: 'create' | 'update' | 'delete') {
    try {
      const response = await axios.post(`${this.adminApiUrl}/sync/deposit`, {
        operation,
        data: deposit
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.ADMIN_API_KEY}`
        }
      });

      if (response.status !== 200) {
        throw new Error(`Failed to sync deposit: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error syncing deposit to admin:', error);
      throw error;
    }
  }

  private async syncUserToAdmin(user: any, operation: 'create' | 'update' | 'delete') {
    try {
      const response = await axios.post(`${this.adminApiUrl}/sync/user`, {
        operation,
        data: user
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.ADMIN_API_KEY}`
        }
      });

      if (response.status !== 200) {
        throw new Error(`Failed to sync user: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error syncing user to admin:', error);
      throw error;
    }
  }

  async stopSync() {
    // 清理轮询定时器
    clearInterval(this.pollingInterval);
  }
}

export const syncService = new SyncService();

export async function syncUserData(userId: string) {
  try {
    const user = await User.findById(userId).exec();
    if (!user) {
      throw new Error('User not found');
    }

    const transactions = await Transaction.find({ userId });
    return {
      user,
      transactions
    };
  } catch (error) {
    console.error('Error syncing user data:', error);
    throw error;
  }
} 