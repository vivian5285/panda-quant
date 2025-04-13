import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import User from '../models/user.model';
import Referral from '../models/referral.model';

const router = express.Router();

// 生成唯一的邀请码
const generateInviteCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, inviteCode } = req.body;

    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '邮箱已被注册' });
    }

    // 检查邀请码是否有效
    let referredBy = null;
    if (inviteCode) {
      const referrer = await User.findOne({ inviteCode });
      if (!referrer) {
        return res.status(400).json({ message: '无效的邀请码' });
      }
      referredBy = referrer._id;
    }

    // 生成新的邀请码
    const newInviteCode = generateInviteCode();

    // 创建新用户
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      username,
      inviteCode: newInviteCode,
      referredBy
    });

    await user.save();

    // 如果使用了邀请码，创建推荐记录
    if (referredBy) {
      const referral = new Referral({
        referrerId: referredBy,
        referredId: user._id,
        commission: 20, // 一代推荐奖励
        level: '一代',
        status: 'pending'
      });
      await referral.save();

      // 如果推荐人也有推荐人，创建二代推荐记录
      const referrer = await User.findById(referredBy);
      if (referrer?.referredBy) {
        const secondLevelReferral = new Referral({
          referrerId: referrer.referredBy,
          referredId: user._id,
          commission: 10, // 二代推荐奖励
          level: '二代',
          status: 'pending'
        });
        await secondLevelReferral.save();
      }
    }

    // 生成 JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      message: '注册成功',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        inviteCode: user.inviteCode
      }
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: '注册失败' });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 生成 JWT token
    const token = generateToken(user._id);

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        inviteCode: user.inviteCode
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: '登录失败' });
  }
});

export default router; 