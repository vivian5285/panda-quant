import mongoose from 'mongoose';
import { Deposit } from '../models/deposit';
import { User } from '../models/user.model';
import axios from 'axios';
import { Transaction } from '../models/transaction.model';

export class SyncService {
  private depositStream: any;
  private userStream: any;
  private adminApiUrl: string;

  constructor() {
    this.adminApiUrl = process.env.ADMIN_API_URL || 'http://localhost:3001/api';
  }

  async startSync() {
    try {
      // 监听 Deposit 集合的变化
      this.depositStream = Deposit.watch();
      this.depositStream.on('change', async (change: any) => {
        await this.handleDepositChange(change);
      });

      // 监听 User 集合的变化
      this.userStream = User.watch();
      this.userStream.on('change', async (change: any) => {
        await this.handleUserChange(change);
      });

      console.log('Sync service started successfully');
    } catch (error) {
      console.error('Failed to start sync service:', error);
      // 重试机制
      setTimeout(() => this.startSync(), 5000);
    }
  }

  private async handleDepositChange(change: any) {
    try {
      const { operationType, fullDocument } = change;
      
      switch (operationType) {
        case 'insert':
          await this.syncDepositToAdmin(fullDocument, 'create');
          break;
        case 'update':
          const updatedDoc = await Deposit.findById(change.documentKey._id);
          if (updatedDoc) {
            await this.syncDepositToAdmin(updatedDoc, 'update');
          }
          break;
        case 'delete':
          await this.syncDepositToAdmin({ _id: change.documentKey._id }, 'delete');
          break;
      }
    } catch (error) {
      console.error('Error handling deposit change:', error);
      // 重试机制
      await this.retrySyncDeposit(change);
    }
  }

  private async handleUserChange(change: any) {
    try {
      const { operationType, fullDocument } = change;
      
      switch (operationType) {
        case 'insert':
          await this.syncUserToAdmin(fullDocument, 'create');
          break;
        case 'update':
          const updatedDoc = await User.findById(change.documentKey._id);
          if (updatedDoc) {
            await this.syncUserToAdmin(updatedDoc, 'update');
          }
          break;
        case 'delete':
          await this.syncUserToAdmin({ _id: change.documentKey._id }, 'delete');
          break;
      }
    } catch (error) {
      console.error('Error handling user change:', error);
      // 重试机制
      await this.retrySyncUser(change);
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

  private async retrySyncDeposit(change: any, retries = 3) {
    if (retries <= 0) {
      console.error('Max retries reached for deposit sync');
      return;
    }

    try {
      await this.handleDepositChange(change);
    } catch (error) {
      console.error(`Retry ${retries} failed for deposit sync:`, error);
      setTimeout(() => this.retrySyncDeposit(change, retries - 1), 5000);
    }
  }

  private async retrySyncUser(change: any, retries = 3) {
    if (retries <= 0) {
      console.error('Max retries reached for user sync');
      return;
    }

    try {
      await this.handleUserChange(change);
    } catch (error) {
      console.error(`Retry ${retries} failed for user sync:`, error);
      setTimeout(() => this.retrySyncUser(change, retries - 1), 5000);
    }
  }

  async stopSync() {
    if (this.depositStream) {
      await this.depositStream.close();
    }
    if (this.userStream) {
      await this.userStream.close();
    }
  }
}

export const syncService = new SyncService();

export async function syncUserData(userId: string) {
  try {
    const user = await User.findById(userId);
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