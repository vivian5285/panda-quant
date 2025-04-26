import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import { IUser } from '@shared/models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 生成随机推荐码
const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// 初始化管理员账户
export const initAdmin = async () => {
  try {
    const admin = await User.findOne({ isAdmin: true });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        isAdmin: true,
        balance: 0
      });
      console.log('Admin account created');
    }
  } catch (error) {
    console.error('Error creating admin account:', error);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, referralCode } = req.body;

    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // 创建新用户
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: 'user',
      status: 'active',
      balance: 0
    });

    // 生成 JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        balance: newUser.balance,
        status: newUser.status
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 更新最后登录时间
    user.lastLogin = new Date();
    await user.save();

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        balance: user.balance,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 生成重置令牌
    const resetToken = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // TODO: 发送包含重置令牌的邮件
    // 这里应该实现邮件发送逻辑

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    // 验证重置令牌
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 更新密码
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    if (!user || !user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { email, password, status } = req.body;

    const existingUser = await User.findById(user._id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 更新可修改的字段
    if (email) existingUser.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.password = hashedPassword;
    }
    if (status) existingUser.status = status;

    await existingUser.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // 由于我们使用 JWT，客户端需要自行删除 token
    // 这里可以添加一些清理逻辑，比如记录登出时间等
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = await User.create({
      email,
      password: hashedPassword,
      role: 'admin',
      status: 'active',
      isAdmin: true,
      balance: 0
    });

    res.status(201).json({ message: 'Admin created successfully', admin });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin', error });
  }
}; 