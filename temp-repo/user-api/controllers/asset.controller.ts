import { Request, Response } from 'express';
import { Asset, Payment, ChainAddress } from '../models/asset.model';
import { User } from '../models/user.model';

// 获取资产概览
export const getAssetSummary = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 获取或创建资产记录
    let asset = await Asset.findOne({ userId });
    if (!asset) {
      asset = await Asset.create({
        userId,
        balance: 0,
        totalProfit: 0,
        isNewUser: true
      });
    }

    // 获取充值记录
    const deposits = await Payment.find({
      userId,
      type: 'DEPOSIT'
    }).sort({ createdAt: -1 });

    // 获取托管费记录
    const fees = await Payment.find({
      userId,
      type: 'FEE'
    }).sort({ createdAt: -1 });

    // 计算托管费（总收益的10%）
    const hostingFee = asset.totalProfit * 0.1;

    res.json({
      totalBalance: asset.balance,
      totalProfit: asset.totalProfit,
      hostingFee, // 托管费
      isNewUser: asset.isNewUser,
      deposits,
      fees
    });
  } catch (error) {
    console.error('Error getting asset summary:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 获取链地址
export const getChainAddresses = async (req: Request, res: Response) => {
  try {
    const addresses = await ChainAddress.find({
      isActive: true,
      chain: { $in: ['BSC', 'TRC20', 'ARB', 'OP', 'SOL'] }
    });
    res.json(addresses);
  } catch (error) {
    console.error('Error getting chain addresses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 创建充值记录
export const createDeposit = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { chain, amount } = req.body;
    const userId = req.user.id;

    // 验证链类型
    if (!['BSC', 'TRC20', 'ARB', 'OP', 'SOL'].includes(chain)) {
      return res.status(400).json({ message: 'Invalid chain type' });
    }

    // 获取链地址信息
    const chainAddress = await ChainAddress.findOne({ chain, isActive: true });
    if (!chainAddress) {
      return res.status(400).json({ message: 'Chain address not found' });
    }

    // 验证最小充值金额
    if (amount < chainAddress.minAmount) {
      return res.status(400).json({ 
        message: `Minimum deposit amount is ${chainAddress.minAmount} USDT` 
      });
    }

    // 创建充值记录
    const payment = await Payment.create({
      userId,
      type: 'DEPOSIT',
      chain,
      amount,
      status: 'PENDING'
    });

    res.json({
      paymentId: payment._id,
      address: chainAddress.address,
      minAmount: chainAddress.minAmount,
      fee: chainAddress.fee
    });
  } catch (error) {
    console.error('Error creating deposit:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 确认充值
export const confirmDeposit = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { paymentId } = req.params;
    const { txHash } = req.body;
    const userId = req.user.id;

    // 查找充值记录
    const payment = await Payment.findOne({
      _id: paymentId,
      userId,
      type: 'DEPOSIT',
      status: 'PENDING'
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // 更新充值状态
    payment.status = 'COMPLETED';
    payment.txHash = txHash;
    await payment.save();

    // 更新用户资产余额
    const asset = await Asset.findOne({ userId });
    if (asset) {
      asset.balance += payment.amount;
      await asset.save();
    }

    res.json({ message: 'Deposit confirmed successfully' });
  } catch (error) {
    console.error('Error confirming deposit:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 更新用户收益
export const updateUserProfit = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { userId } = req.params;
    const { profit } = req.body;

    const asset = await Asset.findOne({ userId });
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // 更新总收益
    asset.totalProfit += profit;
    await asset.save();

    // 计算托管费
    const hostingFee = asset.totalProfit * 0.1;

    // 创建托管费记录
    await Payment.create({
      userId,
      type: 'FEE',
      amount: hostingFee,
      status: 'PENDING'
    });

    res.json({ 
      message: 'Profit updated successfully',
      totalProfit: asset.totalProfit,
      hostingFee
    });
  } catch (error) {
    console.error('Error updating user profit:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 