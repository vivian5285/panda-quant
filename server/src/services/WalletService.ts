import { Types } from 'mongoose';
import { Wallet } from '../models/Wallet.model';
import { IWallet, IWalletDocument } from '../types/Wallet';
import { logger } from '../utils/Logger';

export class WalletService {
  private static instance: WalletService;

  private constructor() {}

  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  private convertToIWallet(wallet: IWalletDocument): IWallet {
    return {
      _id: wallet._id,
      userId: wallet.userId,
      balances: wallet.balances,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt
    };
  }

  async createWallet(walletData: Partial<IWallet>): Promise<IWallet> {
    try {
      const wallet = new Wallet(walletData);
      const savedWallet = await wallet.save();
      return this.convertToIWallet(savedWallet);
    } catch (error) {
      logger.error('Error creating wallet:', error);
      throw error;
    }
  }

  async getWalletById(id: string): Promise<IWallet | null> {
    try {
      const wallet = await Wallet.findById(id);
      return wallet ? this.convertToIWallet(wallet) : null;
    } catch (error) {
      logger.error('Error getting wallet:', error);
      throw error;
    }
  }

  async getWalletByUserId(userId: string): Promise<IWallet | null> {
    try {
      const wallet = await Wallet.findOne({ userId: new Types.ObjectId(userId) });
      return wallet ? this.convertToIWallet(wallet) : null;
    } catch (error) {
      logger.error('Error getting wallet by user id:', error);
      throw error;
    }
  }

  async updateWallet(id: string, data: Partial<IWallet>): Promise<IWallet | null> {
    try {
      const wallet = await Wallet.findByIdAndUpdate(id, data, { new: true });
      return wallet ? this.convertToIWallet(wallet) : null;
    } catch (error) {
      logger.error('Error updating wallet:', error);
      throw error;
    }
  }

  async deleteWallet(id: string): Promise<boolean> {
    try {
      const result = await Wallet.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      logger.error('Error deleting wallet:', error);
      throw error;
    }
  }
} 