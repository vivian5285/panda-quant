const User = require('../models/user.model'); // 确认用户模型路径
const { sendNotification } = require('../controllers/notificationController');

// 定义余额和托管费的阈值
const LOW_BALANCE_THRESHOLD = 10; // 美元或其他货币单位
const LOW_HOSTING_FEE_THRESHOLD = 5; // 假设托管费也有一个阈值

/**
 * 检查用户余额和托管费，并发送提醒通知
 */
const checkBalancesAndSendReminders = async () => {
  console.log('Running balance and hosting fee reminder task...');
  try {
    // 获取所有需要检查的用户 (可以根据需要添加筛选条件，例如只检查活跃用户)
    // 注意：如果用户量很大，一次性获取所有用户可能导致内存问题
    // 可以考虑分批处理 (pagination) 或流式处理 (streaming)
    const users = await User.find({}).select('balance hostingFeeRemaining _id').lean(); // 只选择需要的字段

    console.log(`Found ${users.length} users to check.`);

    for (const user of users) {
      // 检查余额
      if (user.balance < LOW_BALANCE_THRESHOLD) {
        const title = '余额不足提醒';
        const message = `尊敬的用户，您的账户余额已低于 ${LOW_BALANCE_THRESHOLD}，为避免影响服务，请及时充值。当前余额：${user.balance}`;
        await sendNotification(user._id.toString(), title, message, 'balance_low');
      }

      // 检查托管费 (假设用户模型中有 hostingFeeRemaining 字段)
      if (user.hostingFeeRemaining !== undefined && user.hostingFeeRemaining < LOW_HOSTING_FEE_THRESHOLD) {
        const title = '托管费不足提醒';
        const message = `尊敬的用户，您的托管费用即将不足（剩余 ${user.hostingFeeRemaining}），为避免托管中断，请及时充值托管费。`;
        await sendNotification(user._id.toString(), title, message, 'hosting_fee_low');
      }
    }

    console.log('Balance and hosting fee reminder task completed.');
  } catch (error) {
    console.error('Error during balance reminder task:', error);
  }
};

module.exports = checkBalancesAndSendReminders; 