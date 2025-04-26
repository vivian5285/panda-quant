const Notification = require('../models/notification.model'); // 确保后缀是 .model.ts 或根据编译后的 JS 文件调整

/**
 * 发送通知的内部函数
 * @param {string} userId - 用户 ID
 * @param {string} title - 通知标题
 * @param {string} message - 通知内容
 * @param {string} type - 通知类型 (来自 enum)
 * @returns {Promise<void>}
 */
async function sendNotification(userId, title, message, type = 'other') {
  if (!userId || !title || !message) {
    console.error('Missing required fields for sending notification.');
    // 在实际应用中，可能需要抛出错误或返回特定值
    return;
  }

  // 可以在这里添加对 type 是否在 enum 中的验证
  const validTypes = ['balance_low', 'hosting_fee_low', 'system', 'registration', 'payment', 'other'];
  if (!validTypes.includes(type)) {
      console.warn(`Invalid notification type: ${type}. Defaulting to 'other'.`);
      type = 'other';
  }

  try {
    const notification = new Notification({
      userId,
      title,
      message,
      type, // 保存类型
      status: 'unread', // 确保新通知状态是 unread
    });

    await notification.save();
    console.log(`Notification sent to user ${userId}: [${type}] ${title}`);
    // 此处可以添加集成其他通知方式的逻辑，如邮件、短信等
  } catch (error) {
    console.error(`Error sending notification to user ${userId}:`, error);
    // 根据需要处理错误，例如记录日志
  }
}

module.exports = { sendNotification }; 