import express from 'express';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 生成 JWT token
const generateToken = (userId: string, role: string) => {
  return jwt.sign(
    { id: userId, role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// 注册接口
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 验证必填字段
    if (!email || !password) {
      return res.status(400).json({ message: '请提供邮箱和密码' });
    }

    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '邮箱已被注册' });
    }

    // 创建新用户
    const user = await User.create({
      email,
      password,
      name: email.split('@')[0], // 默认使用邮箱前缀作为用户名
      role: 'user',
      status: 'active',
      referralCode: nanoid(8) // 生成8位推荐码
    });

    // 生成 JWT token
    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({ 
      message: '注册成功',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.status
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
    const { identifier, password } = req.body;

    // 验证必填字段
    if (!identifier || !password) {
      return res.status(400).json({ message: '请提供邮箱和密码' });
    }

    // 查找用户
    let user;
    if (identifier.includes('@')) {
      user = await User.findOne({ email: identifier });
    } else {
      user = await User.findOne({ username: identifier });
    }

    if (!user) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 检查用户状态
    if (user.status !== 'active') {
      return res.status(403).json({ message: '账户已被禁用' });
    }

    // 生成 JWT token
    const token = generateToken(user._id.toString(), user.role);

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
        balance: user.balance,
        accountBalance: user.accountBalance
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router; 