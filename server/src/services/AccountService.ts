import { Types } from 'mongoose';
import { Account } from '../models/Account.model';
import { IAccount, IAccountDocument } from '../types/Account';
import { logger } from '../utils/Logger';

export class AccountService {
  private static instance: AccountService;

  private constructor() {}

  public static getInstance(): AccountService {
    if (!AccountService.instance) {
      AccountService.instance = new AccountService();
    }
    return AccountService.instance;
  }

  private convertToIAccount(account: IAccountDocument): IAccount {
    return {
      _id: account._id as Types.ObjectId,
      userId: account.userId,
      exchange: account.exchange,
      apiKey: account.apiKey,
      apiSecret: account.apiSecret,
      status: account.status,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt
    };
  }

  async createAccount(accountData: Partial<IAccount>): Promise<IAccount> {
    try {
      const account = new Account(accountData);
      const savedAccount = await account.save();
      return this.convertToIAccount(savedAccount);
    } catch (error) {
      logger.error('Error creating account:', error);
      throw error;
    }
  }

  async getAccountById(id: string): Promise<IAccount | null> {
    try {
      const account = await Account.findById(id);
      return account ? this.convertToIAccount(account) : null;
    } catch (error) {
      logger.error('Error getting account:', error);
      throw error;
    }
  }

  async getAccountsByUserId(userId: string): Promise<IAccount[]> {
    try {
      const accounts = await Account.find({ userId: new Types.ObjectId(userId) });
      return accounts.map(account => this.convertToIAccount(account));
    } catch (error) {
      logger.error('Error getting accounts by user id:', error);
      throw error;
    }
  }

  async getAccountsByExchange(exchange: string): Promise<IAccount[]> {
    try {
      const accounts = await Account.find({ exchange });
      return accounts.map((account: IAccountDocument) => this.convertToIAccount(account));
    } catch (error) {
      logger.error('Error getting accounts by exchange:', error);
      throw error;
    }
  }

  async updateAccount(id: string, data: Partial<IAccount>): Promise<IAccount | null> {
    try {
      const account = await Account.findByIdAndUpdate(id, data, { new: true });
      return account ? this.convertToIAccount(account) : null;
    } catch (error) {
      logger.error('Error updating account:', error);
      throw error;
    }
  }

  async deleteAccount(id: string): Promise<boolean> {
    try {
      const result = await Account.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      logger.error('Error deleting account:', error);
      throw error;
    }
  }

  async updateAccountStatus(id: string, status: string): Promise<IAccount | null> {
    try {
      const account = await Account.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      );
      return account ? this.convertToIAccount(account) : null;
    } catch (error) {
      logger.error('Error updating account status:', error);
      throw error;
    }
  }
} 