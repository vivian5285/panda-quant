import { User } from '../src/models/User';
import { Fee } from '../src/models/Fee';
import { logger } from '../src/utils/logger';

export const deductHostingFees = async (): Promise<void> => {
  try {
    const users = await User.find({ isVerified: true });
    
    for (const user of users) {
      const fee = new Fee({
        userId: user._id,
        amount: user.subscriptionFee || 10, // 使用用户的订阅费用或默认值
        type: 'hosting',
        status: 'PENDING'
      });
      
      await fee.save();
      
      // 更新用户余额
      user.accountBalance -= fee.amount;
      await user.save();
      
      logger.info(`Deducted hosting fee for user ${user._id}`);
    }
  } catch (error) {
    logger.error('Error deducting hosting fees:', error);
  }
};

export const scheduleWeeklyFeeDeduction = async (): Promise<void> => {
  try {
    await deductHostingFees();
    logger.info('Weekly fee deduction completed successfully');
  } catch (error) {
    logger.error('Error in weekly fee deduction:', error);
  }
}; 