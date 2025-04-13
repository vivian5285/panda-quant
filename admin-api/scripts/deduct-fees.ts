import cron from 'node-cron';
import { User } from '../models/user.model';
import { Order } from '../models/order.model';

const deductHostingFees = async () => {
  try {
    const users = await User.find({ status: 'active' });
    const HOSTING_FEE = 10; // 每周托管费用

    for (const user of users) {
      if (user.balance >= HOSTING_FEE) {
        // 扣除托管费
        user.balance -= HOSTING_FEE;
        await user.save();

        // 创建订单记录
        await Order.create({
          userId: user._id,
          type: 'hosting_fee',
          amount: HOSTING_FEE,
          status: 'completed',
        });
      } else {
        // 余额不足，暂停用户
        user.status = 'suspended';
        await user.save();
      }
    }

    console.log('托管费扣除完成');
  } catch (error) {
    console.error('托管费扣除失败:', error);
  }
};

// 每周一凌晨 2 点执行
cron.schedule('0 2 * * 1', deductHostingFees);

console.log('托管费扣除定时任务已启动'); 