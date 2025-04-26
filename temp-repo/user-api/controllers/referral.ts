import { User } from '../models/user.model';
import { ReferralCommission } from '../models/referral.model';

export async function triggerReferralCommission(userId: string, amount: number): Promise<void> {
  try {
    // 获取用户信息
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // 计算一代推荐人奖励（20%）
    if (user.referredBy) {
      const firstLevelCommission = amount * 0.2;
      await createCommissionRecord(userId, user.referredBy, firstLevelCommission, 1);

      // 获取一代推荐人信息
      const firstLevelReferrer = await User.findById(user.referredBy);
      if (firstLevelReferrer?.referredBy) {
        // 计算二代推荐人奖励（10%）
        const secondLevelCommission = amount * 0.1;
        await createCommissionRecord(userId, firstLevelReferrer.referredBy, secondLevelCommission, 2);
      }
    }
  } catch (error) {
    console.error('Error triggering referral commission:', error);
    throw error;
  }
}

async function createCommissionRecord(
  userId: string,
  referrerId: string,
  amount: number,
  level: number
): Promise<void> {
  await ReferralCommission.create({
    userId,
    referrerId,
    amount,
    level
  });
} 