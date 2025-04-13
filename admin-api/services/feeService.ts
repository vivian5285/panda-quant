import { Asset } from '../models/Asset';
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';
import cron from 'node-cron';

// 每月1号凌晨执行
const FEE_SCHEDULE = '0 0 1 * *';

// 基础托管费
const BASE_FEE = 100;

export class FeeService {
  private static instance: FeeService;

  private constructor() {
    this.startFeeScheduler();
  }

  public static getInstance(): FeeService {
    if (!FeeService.instance) {
      FeeService.instance = new FeeService();
    }
    return FeeService.instance;
  }

  private startFeeScheduler() {
    cron.schedule(FEE_SCHEDULE, async () => {
      try {
        await this.processMonthlyFees();
      } catch (error) {
        console.error('Error processing monthly fees:', error);
      }
    });
  }

  private async processMonthlyFees() {
    const users = await User.find({});
    
    for (const user of users) {
      try {
        // 获取用户所有资产
        const assets = await Asset.find({ userId: user._id });
        
        if (assets.length === 0) continue;

        // 计算总资产
        const totalBalance = assets.reduce((sum, asset) => sum + asset.balance, 0);
        
        // 计算托管费（新用户首月有30美元折扣）
        const isNewUser = await this.isNewUser(user._id);
        const feeAmount = isNewUser ? Math.max(0, BASE_FEE - 30) : BASE_FEE;

        // 检查用户余额是否足够
        if (totalBalance < feeAmount) {
          console.log(`Insufficient balance for user ${user._id}`);
          continue;
        }

        // 创建托管费交易记录
        await Transaction.create({
          userId: user._id,
          type: 'FEE',
          amount: feeAmount,
          chain: 'BSC', // 默认从BSC链扣除
          status: 'PENDING',
          txHash: `FEE-${Date.now()}-${user._id}`
        });

        // 更新用户资产
        const mainAsset = assets.find(asset => asset.chain === 'BSC');
        if (mainAsset) {
          mainAsset.balance -= feeAmount;
          await mainAsset.save();
        }

      } catch (error) {
        console.error(`Error processing fee for user ${user._id}:`, error);
      }
    }
  }

  private async isNewUser(userId: string): Promise<boolean> {
    const feeTransactions = await Transaction.find({
      userId,
      type: 'FEE'
    });
    return feeTransactions.length === 0;
  }

  // 处理充值确认
  public async confirmDeposit(userId: string, txHash: string, amount: number, chain: string) {
    try {
      // 查找待处理的充值交易
      const transaction = await Transaction.findOne({
        userId,
        txHash,
        type: 'DEPOSIT',
        status: 'PENDING'
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // 更新交易状态
      transaction.status = 'COMPLETED';
      await transaction.save();

      // 更新用户资产
      let asset = await Asset.findOne({ userId, chain });
      if (!asset) {
        asset = await Asset.create({
          userId,
          chain,
          address: '', // 需要从用户信息中获取
          balance: amount
        });
      } else {
        asset.balance += amount;
        await asset.save();
      }

      return true;
    } catch (error) {
      console.error('Error confirming deposit:', error);
      throw error;
    }
  }
} 