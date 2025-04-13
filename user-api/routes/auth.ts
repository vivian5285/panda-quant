import express from 'express';
import { User } from '../models/user.model';
import { generateToken } from '../middlewares/auth';

const router = express.Router();

// 注册接口
router.post('/register', async (req, res) => {
  try {
    const { email, password, inviteCode } = req.body;

    // 验证必填字段
    if (!email || !password || !inviteCode) {
      return res.status(400).json({ message: '请提供所有必填字段' });
    }

    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '邮箱已被注册' });
    }

    // 查找推荐人
    let referredBy = null;
    if (inviteCode) {
      const referrer = await User.findOne({ inviteCode });
      if (referrer) {
        referredBy = referrer._id.toString();
      }
    }

    // 创建新用户
    const user = await User.create({
      email,
      password,
      inviteCode,
      referredBy
    });

    res.status(201).json({ 
      message: '注册成功',
      user: {
        id: user._id,
        email: user.email,
        inviteCode: user.inviteCode,
        referredBy: user.referredBy
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 登录接口
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 验证必填字段
    if (!email || !password) {
      return res.status(400).json({ message: '请提供邮箱和密码' });
    }

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 生成 JWT token
    const token = generateToken(user._id.toString(), user.role);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router; 