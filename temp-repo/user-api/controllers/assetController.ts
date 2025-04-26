import { Request, Response } from 'express';
import { UserAsset, Deposit, Fee } from '../../shared/models/asset';
import { User } from '../../shared/models/user';

// 获取资产概览
export const getAssetSummary = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    
    // 获取用户资产
    const userAsset = await UserAsset.findOne({ userId });
    if (!userAsset) {
      return res.status(404).json({ message: '用户资产不存在' });
    }

    // 计算下月托管费
    const user = await User.findById(userId);
    const nextMonthFee = user?.isNewUser ? 0 : 30; // 新用户首月免费

    // 获取充值记录
    const deposits = await Deposit.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    // 获取托管费记录
    const fees = await Fee.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      balance: userAsset.balance,
      nextMonthFee,
      depositHistory: deposits,
      feeHistory: fees
    });
  } catch (error) {
    console.error('Error getting asset summary:', error);
    res.status(500).json({ message: '获取资产概览失败' });
  }
};

// 创建充值订单
export const createDeposit = async (req: Request, res: Response) => {
  try {
    const { chain, amount } = req.body;
    const userId = req.user._id;

    // 验证链类型
    const validChains = ['BSC', 'TRC20', 'ARB', 'OP', 'SOL'];
    if (!validChains.includes(chain)) {
      return res.status(400).json({ message: '无效的链类型' });
    }

    // 验证金额
    if (amount <= 0) {
      return res.status(400).json({ message: '充值金额必须大于0' });
    }

    // 创建充值记录
    const deposit = new Deposit({
      userId,
      amount,
      chain,
      status: 'pending'
    });

    await deposit.save();

    // 获取充值地址
    const depositAddress = getDepositAddress(chain);

    res.json({
      depositId: deposit._id,
      address: depositAddress,
      chain,
      amount
    });
  } catch (error) {
    console.error('Error creating deposit:', error);
    res.status(500).json({ message: '创建充值订单失败' });
  }
};

// 获取链信息
export const getChainInfo = async (req: Request, res: Response) => {
  try {
    const chains = [
      {
        chain: 'BSC',
        address: '0x1234567890123456789012345678901234567890',
        minAmount: 10,
        fee: 1
      },
      {
        chain: 'TRC20',
        address: 'T1234567890123456789012345678901234567890',
        minAmount: 10,
        fee: 1
      },
      {
        chain: 'ARB',
        address: '0x1234567890123456789012345678901234567890',
        minAmount: 10,
        fee: 1
      },
      {
        chain: 'OP',
        address: '0x1234567890123456789012345678901234567890',
        minAmount: 10,
        fee: 1
      },
      {
        chain: 'SOL',
        address: '1234567890123456789012345678901234567890',
        minAmount: 10,
        fee: 1
      }
    ];

    res.json(chains);
  } catch (error) {
    console.error('Error getting chain info:', error);
    res.status(500).json({ message: '获取链信息失败' });
  }
};

// 获取充值地址（实际项目中应该从配置或数据库中获取）
function getDepositAddress(chain: string): string {
  const addresses: { [key: string]: string } = {
    BSC: '0x1234567890123456789012345678901234567890',
    TRC20: 'T1234567890123456789012345678901234567890',
    ARB: '0x1234567890123456789012345678901234567890',
    OP: '0x1234567890123456789012345678901234567890',
    SOL: '1234567890123456789012345678901234567890'
  };
  return addresses[chain] || '';
} 