const express = require('express');
const router = express.Router();
const Notification = require('../models/notification.model'); // 确认模型路径
const { sendNotification } = require('../controllers/notificationController'); // 引入发送逻辑
// 假设您有认证中间件来获取 req.user.id
const authMiddleware = require('../middleware/authMiddleware'); // 请替换为您的认证中间件路径
const mongoose = require('mongoose');

// 应用认证中间件到所有需要用户认证的路由
router.use(authMiddleware);

/**
 * @route   POST /api/notifications/send
 * @desc    (内部或管理员) 发送通知给指定用户
 * @access  Private (需要特定权限，例如管理员)
 */
router.post('/send', async (req, res) => {
  // 注意：这个接口通常应该由后端服务内部调用或管理员使用
  // 不应直接暴露给普通用户随意发送通知
  // 您可能需要添加权限检查
  const { userId, title, message } = req.body;

  if (!userId || !title || !message) {
    return res.status(400).json({ msg: 'Missing required fields: userId, title, message' });
  }

  try {
    // 调用控制器中的发送逻辑
    await sendNotification(userId, title, message);
    res.status(201).json({ msg: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error in POST /api/notifications/send:', error);
    res.status(500).json({ msg: 'Server error while sending notification' });
  }
});

/**
 * @route   GET /api/notifications
 * @desc    获取当前登录用户的所有通知 (支持分页和按类型过滤)
 * @access  Private
 */
router.get('/', async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const filterType = req.query.type; // 获取类型过滤器

  try {
    // 构建查询条件
    const queryConditions = { userId };
    if (filterType) {
      // 验证 filterType 是否是有效的 enum 值 (可选但推荐)
      const validTypes = ['balance_low', 'hosting_fee_low', 'system', 'registration', 'payment', 'other'];
      if (validTypes.includes(filterType)) {
          queryConditions.type = filterType;
      } else {
          console.warn(`Invalid filter type requested: ${filterType}. Ignoring filter.`);
          // 或者返回 400 错误
          // return res.status(400).json({ msg: 'Invalid notification type for filtering' });
      }
    }

    const notifications = await Notification.find(queryConditions) // 应用查询条件
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalNotifications = await Notification.countDocuments(queryConditions);

    res.json({
      notifications,
      currentPage: page,
      totalPages: Math.ceil(totalNotifications / limit),
      totalNotifications,
      filterType: filterType && queryConditions.type ? filterType : undefined, // 返回当前应用的过滤器类型
    });
  } catch (error) {
    console.error('Error in GET /api/notifications:', error);
    res.status(500).json({ msg: 'Server error while fetching notifications' });
  }
});

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    标记指定通知为已读
 * @access  Private
 */
router.put('/:id/read', async (req, res) => {
  const userId = req.user.id;
  const notificationId = req.params.id;

  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: userId }, // 确保用户只能修改自己的通知
      { status: 'read' },
      { new: true } // 返回更新后的文档
    );

    if (!notification) {
      // 如果找不到通知或通知不属于该用户
      return res.status(404).json({ msg: 'Notification not found or access denied' });
    }

    res.json(notification);
  } catch (error) {
    console.error(`Error in PUT /api/notifications/${notificationId}/read:`, error);
    // 处理可能的 CastError (无效的 ID 格式)
    if (error.name === 'CastError') {
        return res.status(400).json({ msg: 'Invalid notification ID format' });
    }
    res.status(500).json({ msg: 'Server error while marking notification as read' });
  }
});


/**
 * @route   PUT /api/notifications/read-all
 * @desc    标记当前用户所有未读通知为已读
 * @access  Private
 */
router.put('/read-all', async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await Notification.updateMany(
            { userId: userId, status: 'unread' },
            { $set: { status: 'read' } }
        );

        res.json({ msg: `Marked ${result.nModified} notifications as read.` });
    } catch (error) {
        console.error('Error in PUT /api/notifications/read-all:', error);
        res.status(500).json({ msg: 'Server error while marking all notifications as read' });
    }
});

/**
 * @route   DELETE /api/notifications/:id
 * @desc    删除指定通知
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  const userId = req.user.id;
  const notificationId = req.params.id;

  try {
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId: userId
    });

    if (!notification) {
      return res.status(404).json({ msg: '通知不存在或无权删除' });
    }

    res.json({ msg: '通知已删除' });
  } catch (error) {
    console.error(`删除通知错误:`, error);
    res.status(500).json({ msg: '服务器错误' });
  }
});

/**
 * @route   DELETE /api/notifications/read
 * @desc    删除所有已读通知
 * @access  Private
 */
router.delete('/read', async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await Notification.deleteMany({
      userId: userId,
      status: 'read'
    });

    res.json({ 
      msg: `已删除 ${result.deletedCount} 条已读通知`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('删除已读通知错误:', error);
    res.status(500).json({ msg: '服务器错误' });
  }
});

/**
 * @route   GET /api/notifications/stats
 * @desc    获取通知统计信息
 * @access  Private
 */
router.get('/stats', async (req, res) => {
  const userId = req.user.id;

  try {
    const stats = await Notification.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          unread: {
            $sum: { $cond: [{ $eq: ['$status', 'unread'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    console.error('获取通知统计错误:', error);
    res.status(500).json({ msg: '服务器错误' });
  }
});

module.exports = router; 