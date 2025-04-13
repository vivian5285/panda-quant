import { Asset, Payment } from '../models/asset.model';
import { Strategy } from '../models/strategy.model';

// 扣除托管费用
export async function deductHostingFee(): Promise<void> {
  try {
    // 获取所有需要扣除费用的用户
    const users = await Asset.find({
      freePeriodEnd: { $lt: new Date() }
    });

    for (const user of users) {
      // 获取用户最近一周的收益
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const strategies = await Strategy.find({
        userId: user.userId,
        createdAt: { $gte: oneWeekAgo }
      });

      const totalProfit = strategies.reduce((sum, strategy) => sum + strategy.balance, 0);
      const hostingFee = totalProfit * 0.1; // 10% 托管费

      if (hostingFee > 0) {
        // 优先使用抵扣券
        let remainingFee = hostingFee;
        if (user.voucher > 0) {
          const voucherUsed = Math.min(user.voucher, hostingFee);
          user.voucher -= voucherUsed;
          remainingFee -= voucherUsed;
        }

        // 如果还有剩余费用，从余额中扣除
        if (remainingFee > 0) {
          if (user.balance >= remainingFee) {
            user.balance -= remainingFee;
          } else {
            // 余额不足，标记为欠费
            user.balance = 0;
            // TODO: 发送欠费通知
          }
        }

        // 记录支付记录
        await Payment.create({
          userId: user.userId,
          type: 'commission',
          amount: hostingFee,
          chain: 'system',
          status: 'completed'
        });

        await user.save();
      }
    }
  } catch (error) {
    console.error('Error deducting hosting fee:', error);
    throw error;
  }
}

// 记录充值
export async function recordDeposit(userId: string, amount: number, chain: string, txHash: string): Promise<void> {
  try {
    // 更新用户资产
    const asset = await Asset.findOne({ userId });
    if (!asset) {
      throw new Error('Asset not found');
    }

    asset.balance += amount;
    await asset.save();

    // 记录支付记录
    await Payment.create({
      userId,
      type: 'deposit',
      amount,
      chain,
      status: 'completed',
      txHash
    });
  } catch (error) {
    console.error('Error recording deposit:', error);
    throw error;
  }
} 