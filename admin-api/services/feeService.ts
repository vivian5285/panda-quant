import { Fee } from '../models/fee.model';
import { User } from '../models/user.model';
import { UserAsset } from '../models/userAsset.model';
import { Asset } from '../models/asset.model';
import { Transaction } from '../models/Transaction';
import cron from 'node-cron';

// 每月1号凌晨执行
const FEE_SCHEDULE = '0 0 1 * *';

// 基础托管费
const BASE_FEE = 100;

// 扩展IAsset接口，添加chain属性
interface IAssetWithChain {
    chain: string;
    balance: number;
    userId: string;
}

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
        const userId = (user._id as string).toString();
        // 获取用户所有资产
        const assets = await Asset.find({ userId });
        
        if (assets.length === 0) continue;

        // 计算总资产
        const totalBalance = assets.reduce((sum, asset) => sum + asset.balance, 0);
        
        // 计算托管费（新用户首月有30美元折扣）
        const isNewUser = await this.isNewUser(userId);
        const feeAmount = isNewUser ? Math.max(0, BASE_FEE - 30) : BASE_FEE;

        // 检查用户余额是否足够
        if (totalBalance < feeAmount) {
          console.log(`Insufficient balance for user ${userId}`);
          continue;
        }

        // 创建托管费交易记录
        await Transaction.create({
          userId,
          type: 'FEE',
          amount: feeAmount,
          chain: 'BSC', // 默认从BSC链扣除
          status: 'PENDING',
          txHash: `FEE-${Date.now()}-${userId}`
        });

        // 更新用户资产
        const mainAsset = assets.find(asset => {
          const assetWithChain = asset as unknown as IAssetWithChain;
          return assetWithChain.chain === 'BSC';
        });
        if (mainAsset) {
          mainAsset.balance -= feeAmount;
          await mainAsset.save();
        }

      } catch (error) {
        console.error(`Error processing fee for user ${user._id}:`, error);
      }
    }
  }

  private async isNewUser(userId: unknown): Promise<boolean> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentFees = await Fee.find({
      userId: (userId as string).toString(),
      type: 'monthly',
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    return recentFees.length === 0;
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

  async calculateFee(_user: unknown, _asset: unknown, amount: number): Promise<number> {
    // 这里实现费用计算逻辑
    return amount * 0.01; // 示例：1% 的费用
  }

  async createFee(userId: string, amount: number, type: 'monthly' | 'withdrawal') {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const userAsset = await Asset.findOne({ userId });
    if (!userAsset) {
      throw new Error('User asset not found');
    }

    // 确保 userAsset 有 chain 属性
    const assetWithChain = userAsset as unknown as IAssetWithChain;
    if (!assetWithChain.chain) {
      throw new Error('Asset chain information is missing');
    }

    const fee = new Fee({
      userId,
      amount,
      type,
      status: 'completed',
      chain: assetWithChain.chain
    });

    return await fee.save();
  }

  async processFee(feeId: string): Promise<void> {
    const fee = await Fee.findById(feeId);
    if (!fee) {
      throw new Error('Fee not found');
    }

    // 创建交易记录
    await Transaction.create({
      userId: fee.userId,
      type: 'fee',
      amount: fee.amount,
      status: 'completed'
    });

    // 更新费用状态
    await Fee.findByIdAndUpdate(feeId, { status: 'completed' });
  }

  async getMainAsset(userId: string): Promise<IAssetWithChain | null> {
    const assets = await Asset.find({ userId });
    if (!assets || assets.length === 0) {
      return null;
    }

    // 查找 BSC 链上的资产
    const mainAsset = assets.find(asset => {
      const assetWithChain = asset as unknown as IAssetWithChain;
      return assetWithChain.chain === 'BSC';
    });

    return mainAsset as unknown as IAssetWithChain;
  }
}

export const feeService = FeeService.getInstance(); 