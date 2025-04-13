import express from 'express';
import { authenticateToken } from '../middleware/auth';
import Referral from '../models/referral.model';
import User from '../models/user.model';

const router = express.Router();

// 获取用户的推荐奖励总结
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // 获取用户的推荐码
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 获取一代推荐用户
    const firstLevelReferrals = await User.find({ referredBy: userId });
    
    // 获取二代推荐用户
    const secondLevelReferrals = await User.find({
      referredBy: { $in: firstLevelReferrals.map(u => u._id) }
    });

    // 计算一代推荐奖励
    const firstLevelCommission = firstLevelReferrals.length * 20;
    
    // 计算二代推荐奖励
    const secondLevelCommission = secondLevelReferrals.length * 10;

    // 获取推荐历史记录
    const referralHistory = await Referral.find({ referrerId: userId })
      .populate('referredId', 'email')
      .sort({ createdAt: -1 });

    // 计算总奖励
    const totalCommission = referralHistory
      .filter(record => record.status === 'completed')
      .reduce((sum, record) => sum + record.commission, 0);

    res.json({
      referralCode: user.inviteCode,
      referredUsers: firstLevelReferrals.length + secondLevelReferrals.length,
      commissionEarned: totalCommission,
      firstLevelReferrals: firstLevelReferrals.length,
      secondLevelReferrals: secondLevelReferrals.length,
      firstLevelCommission,
      secondLevelCommission,
      referralHistory: referralHistory.map(record => ({
        referredEmail: (record.referredId as any).email,
        commission: record.commission,
        date: record.createdAt,
        level: record.level,
        status: record.status
      }))
    });
  } catch (error) {
    console.error('Error fetching referral summary:', error);
    res.status(500).json({ message: '获取推荐数据失败' });
  }
});

// 创建新的推荐记录
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { referredId, level } = req.body;
    const referrerId = req.user.id;

    // 验证被推荐用户是否存在
    const referredUser = await User.findById(referredId);
    if (!referredUser) {
      return res.status(404).json({ message: '被推荐用户不存在' });
    }

    // 检查是否已经存在推荐记录
    const existingReferral = await Referral.findOne({
      referrerId,
      referredId,
      level
    });

    if (existingReferral) {
      return res.status(400).json({ message: '推荐记录已存在' });
    }

    // 计算佣金
    const commission = level === '一代' ? 20 : 10;

    // 创建推荐记录
    const referral = new Referral({
      referrerId,
      referredId,
      commission,
      level,
      status: 'pending'
    });

    await referral.save();

    res.status(201).json({
      message: '推荐记录创建成功',
      referral
    });
  } catch (error) {
    console.error('Error creating referral:', error);
    res.status(500).json({ message: '创建推荐记录失败' });
  }
});

// 更新推荐记录状态
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const referral = await Referral.findById(id);
    if (!referral) {
      return res.status(404).json({ message: '推荐记录不存在' });
    }

    // 验证用户权限
    if (referral.referrerId.toString() !== req.user.id) {
      return res.status(403).json({ message: '无权操作此记录' });
    }

    // 更新状态
    referral.status = status;
    await referral.save();

    res.json({
      message: '推荐记录状态更新成功',
      referral
    });
  } catch (error) {
    console.error('Error updating referral status:', error);
    res.status(500).json({ message: '更新推荐记录状态失败' });
  }
});

// 获取推荐记录详情
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const referral = await Referral.findById(id)
      .populate('referrerId', 'email')
      .populate('referredId', 'email');

    if (!referral) {
      return res.status(404).json({ message: '推荐记录不存在' });
    }

    // 验证用户权限
    if (referral.referrerId.toString() !== req.user.id) {
      return res.status(403).json({ message: '无权查看此记录' });
    }

    res.json(referral);
  } catch (error) {
    console.error('Error fetching referral details:', error);
    res.status(500).json({ message: '获取推荐记录详情失败' });
  }
});

export default router; 