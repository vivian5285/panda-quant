import { scheduleJob } from 'node-schedule';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';
import { User, IUser } from '../models/user.model';
import { Transaction } from '../models/transaction.model';

export const scheduleWeeklyFeeDeduction = () => {
  try {
    // 每周一凌晨 2 点执行费用扣除
    scheduleJob('0 2 * * 1', async () => {
      try {
        logger.info('开始执行每周费用扣除');
        
        // 获取所有活跃用户
        const users = await User.find({ 
          status: 'active',
          subscriptionEndDate: { $gt: new Date() }
        });

        logger.info(`找到 ${users.length} 个需要扣除费用的用户`);

        // 对每个用户执行费用扣除
        for (const user of users) {
          try {
            // 计算应扣除的费用
            const fee = user.subscriptionFee || 0;
            
            // 检查用户余额是否足够
            if (user.accountBalance < fee) {
              logger.warn(`用户 ${user._id} 余额不足，无法扣除费用`);
              continue;
            }

            // 扣除费用
            user.accountBalance -= fee;
            await user.save();

            // 记录交易
            await Transaction.create({
              userId: user._id,
              type: 'fee',
              amount: -fee,
              description: '每周订阅费用扣除',
              status: 'completed'
            });

            logger.info(`用户 ${user._id} 费用扣除成功，扣除金额: ${fee}`);
          } catch (error) {
            logger.error(`用户 ${user._id} 费用扣除失败:`, error instanceof Error ? error.message : '未知错误');
          }
        }

        logger.info('每周费用扣除执行完成');
      } catch (error) {
        logger.error('费用扣除失败:', error instanceof Error ? error.message : '未知错误');
      }
    });
    logger.info('每周费用扣除任务已安排');
  } catch (error) {
    logger.error('安排费用扣除任务失败:', error instanceof Error ? error.message : '未知错误');
  }
}; 