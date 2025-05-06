import { User } from '../models/user';
import { Fee } from '../models/fee';
import { logger } from '../utils/logger';

export const deductHostingFees = async (): Promise<void> => {
  try {
    const users = await User.find({ status: 'active' });
    
    for (const user of users) {
      const fee = new Fee({
        userId: user._id,
        amount: 10, // 示例固定费用
        type: 'hosting',
        status: 'PENDING'
      });
      
      await fee.save();
      
      // 更新用户余额
      user.balance -= 10;
      await user.save();
      
      logger.info(`Deducted hosting fee for user ${user._id}`);
    }
  } catch (error) {
    logger.error('Error deducting hosting fees:', error);
  }
}; 