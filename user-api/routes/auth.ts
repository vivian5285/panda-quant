import express, { Request, Response } from 'express';
import { User, IUser } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 生成 JWT token
const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { id: userId, role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// 注册接口
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 验证必填字段
    if (!email || !password) {
      res.status(400).json({ message: '请提供邮箱和密码' });
      return;
    }

    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: '邮箱已被注册' });
      return;
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
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '注册失败，请稍后重试' });
  }
});

// 登录接口
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    // 验证必填字段
    if (!identifier || !password) {
      res.status(400).json({ message: '请提供邮箱和密码' });
      return;
    }

    // 查找用户
    let user: IUser | null;
    if (identifier.includes('@')) {
      user = await User.findOne({ email: identifier });
    } else {
      user = await User.findOne({ username: identifier });
    }

    if (!user) {
      res.status(401).json({ message: '邮箱或密码错误' });
      return;
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: '邮箱或密码错误' });
      return;
    }

    // 检查用户状态
    if (user.status !== 'active') {
      res.status(403).json({ message: '账户已被禁用' });
      return;
    }

    // 生成 JWT token
    const token = generateToken(user._id.toString(), user.role);

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router; 