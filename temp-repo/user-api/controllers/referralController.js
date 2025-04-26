const User = require('../models/user.model');
const Referral = require('../models/referral.model');

// 获取推荐链接
exports.getReferralLink = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const baseUrl = process.env.FRONTEND_URL || 'https://pandatrade.space';
    const referralLink = `${baseUrl}/register?ref=${user.referralCode}`;

    res.json({ referralLink });
  } catch (error) {
    console.error('Error getting referral link:', error);
    res.status(500).json({ error: 'Failed to get referral link' });
  }
};

// 获取推荐人列表
exports.getReferrals = async (req, res) => {
  try {
    const userId = req.user.id;

    // 获取一代推荐
    const firstGen = await Referral.find({ 
      referrerId: userId, 
      referralLevel: 1 
    }).populate('referredId', 'email name createdAt');

    // 获取二代推荐
    const secondGen = await Referral.find({ 
      referrerId: userId, 
      referralLevel: 2 
    }).populate('referredId', 'email name createdAt');

    // 合并并格式化数据
    const referrals = [
      ...firstGen.map(r => ({
        id: r._id,
        email: r.referredId.email,
        name: r.referredId.name,
        level: 1,
        commission: r.commission,
        status: r.status,
        createdAt: r.createdAt,
        referredAt: r.referredId.createdAt
      })),
      ...secondGen.map(r => ({
        id: r._id,
        email: r.referredId.email,
        name: r.referredId.name,
        level: 2,
        commission: r.commission,
        status: r.status,
        createdAt: r.createdAt,
        referredAt: r.referredId.createdAt
      }))
    ];

    // 按时间排序
    referrals.sort((a, b) => new Date(b.referredAt) - new Date(a.referredAt));

    res.json(referrals);
  } catch (error) {
    console.error('Error getting referrals:', error);
    res.status(500).json({ error: 'Failed to get referrals' });
  }
};

// 获取推荐统计
exports.getReferralStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 获取一代推荐统计
    const firstGenStats = await Referral.aggregate([
      { $match: { referrerId: userId, referralLevel: 1 } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          totalCommission: { $sum: '$commission' }
        }
      }
    ]);

    // 获取二代推荐统计
    const secondGenStats = await Referral.aggregate([
      { $match: { referrerId: userId, referralLevel: 2 } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          totalCommission: { $sum: '$commission' }
        }
      }
    ]);

    res.json({
      firstGen: {
        count: firstGenStats[0]?.count || 0,
        totalCommission: firstGenStats[0]?.totalCommission || 0
      },
      secondGen: {
        count: secondGenStats[0]?.count || 0,
        totalCommission: secondGenStats[0]?.totalCommission || 0
      }
    });
  } catch (error) {
    console.error('Error getting referral stats:', error);
    res.status(500).json({ error: 'Failed to get referral stats' });
  }
}; 