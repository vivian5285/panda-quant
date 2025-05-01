import { Request, Response } from 'express';
import { Transaction } from '../models/Transaction';
import { feeService } from '../services/feeService';
import { UserAsset } from '../models/UserAsset';
import { Asset, IAsset } from '../models/Asset';
import { User } from '../models/user.model';
import { AuthRequest } from '../types/auth';

// 获取所有用户资产
export const getAllAssets = async (_req: Request, res: Response): Promise<void> => {
  try {
    const assets = await UserAsset.find()
      .populate('userId', 'email')
      .sort({ updatedAt: -1 });

    res.json(assets);
  } catch (error) {
    console.error('Error getting all assets:', error);
    res.status(500).json({ message: '获取资产列表失败' });
  }
};

// 更新资产状态
export const updateAssetStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const asset = await UserAsset.findById(id);
    if (!asset) {
      res.status(404).json({ message: '资产不存在' });
      return;
    }

    asset.status = status;
    await asset.save();

    res.json(asset);
  } catch (error) {
    console.error('Error updating asset status:', error);
    res.status(500).json({ message: '更新资产状态失败' });
  }
};

// 处理月度托管费
export const processMonthlyFees = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({ isNewUser: false });
    const currentDate = new Date();

    for (const user of users) {
      const userAsset = await UserAsset.findOne({ userId: user._id });
      if (!userAsset) continue;

      // 检查是否需要扣除托管费
      const lastDeduction = userAsset.lastFeeDeduction || userAsset.createdAt;
      const monthsSinceLastDeduction = (currentDate.getTime() - lastDeduction.getTime()) / (1000 * 60 * 60 * 24 * 30);

      if (monthsSinceLastDeduction >= 1) {
        // 创建托管费记录
        await feeService.createFee((user._id as string).toString(), 30, 'monthly');
        
        // 更新用户资产
        userAsset.balance -= 30;
        userAsset.lastFeeDeduction = currentDate;
        await userAsset.save();
      }
    }

    res.json({ message: '托管费处理完成' });
  } catch (error) {
    console.error('Error processing monthly fees:', error);
    res.status(500).json({ message: '处理托管费失败' });
  }
};

export const getAssetSummary = async (_req: Request, res: Response): Promise<void> => {
  try {
    const summary = await UserAsset.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$value' }
        }
      }
    ]);

    res.json(summary);
  } catch (error) {
    console.error('Error getting asset summary:', error);
    res.status(500).json({ message: '获取资产统计失败' });
  }
};

export const getDepositHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const deposits = await Transaction.find({
      userId,
      type: 'deposit'
    }).sort({ createdAt: -1 });

    res.json(deposits);
  } catch (error) {
    console.error('Error getting deposit history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFeeHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const fees = await Transaction.find({
      userId,
      type: 'fee'
    }).sort({ createdAt: -1 });

    res.json(fees);
  } catch (error) {
    console.error('Error getting fee history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const confirmDeposit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { txHash, amount, chain } = req.body;

    if (!txHash || !amount || !chain) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    await feeService.confirmDeposit(userId, txHash, amount, chain);

    res.json({ message: 'Deposit confirmed successfully' });
  } catch (error) {
    console.error('Error confirming deposit:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAssets = async (_req: Request, res: Response): Promise<void> => {
    try {
        const assets = await Asset.find();
        res.json(assets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get assets' });
    }
};

export const getUserAssets = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userAssets = await UserAsset.find({ userId: req.user?._id });
        res.json(userAssets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user assets' });
    }
};

export const updateUserAsset = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { assetId, amount } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        const userAsset = await UserAsset.findOneAndUpdate(
            { userId, assetId },
            { amount, lastUpdated: new Date() },
            { new: true, upsert: true }
        );

        res.json(userAsset);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user asset' });
    }
};

export const calculateTotalValue = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        const userAssets = await UserAsset.find({ userId });
        const assets = await Asset.find();

        let totalValue = 0;
        for (const userAsset of userAssets) {
            const asset = assets.find((a: IAsset) => {
                const assetId = a._id?.toString();
                return assetId === userAsset.assetId;
            });
            if (asset) {
                totalValue += userAsset.amount * asset.price;
            }
        }

        res.json({ totalValue });
    } catch (error) {
        res.status(500).json({ error: 'Failed to calculate total value' });
    }
}; 