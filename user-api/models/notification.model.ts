const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read'], default: 'unread' }, // unread 或 read
  type: {
    type: String,
    enum: ['balance_low', 'hosting_fee_low', 'system', 'registration', 'payment', 'other'], // 定义可能的类型
    default: 'other', // 默认类型
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// 添加索引以优化查询
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, status: 1 });
// 为类型和用户添加索引
notificationSchema.index({ userId: 1, type: 1, createdAt: -1 });


module.exports = mongoose.model('Notification', notificationSchema); 