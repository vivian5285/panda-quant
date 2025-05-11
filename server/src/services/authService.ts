import { Types } from 'mongoose';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.model';
import { IUser, IUserDocument } from '../types/User';
import { ILoginRequest, IRegisterRequest, TokenPayload, AuthResult } from '../types/Auth';
import { logger } from '../utils/Logger';
import { AppError } from '../utils/AppError';

export class AuthService {
  private static instance: AuthService;
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: number;

  private constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    this.JWT_EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN || '86400', 10); // 默认1天（秒）
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private convertToIUser(user: IUserDocument): IUser {
    return {
      _id: user._id,
      email: user.email,
      username: user.username,
      password: user.password,
      name: user.name,
      role: user.role,
      status: user.status,
      level: user.level,
      isAdmin: user.isAdmin,
      permissions: user.permissions,
      balance: user.balance,
      accountBalance: user.accountBalance,
      subscriptionFee: user.subscriptionFee,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      comparePassword: user.comparePassword.bind(user)
    };
  }

  private generateToken(user: IUserDocument): string {
    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };

    const options: SignOptions = {
      expiresIn: this.JWT_EXPIRES_IN
    };

    return jwt.sign(payload, this.JWT_SECRET, options);
  }

  async register(data: IRegisterRequest): Promise<AuthResult> {
    try {
      const user = new User({
        email: data.email,
        username: data.username,
        password: data.password,
        name: data.name
      });

      await user.save();
      const token = this.generateToken(user);

      return {
        token,
        user: {
          _id: user._id.toString(),
          email: user.email,
          name: user.name,
          username: user.username,
          role: user.role,
          isAdmin: user.isAdmin
        }
      };
    } catch (error) {
      logger.error('Error in register:', error);
      throw error;
    }
  }

  async login(data: ILoginRequest): Promise<AuthResult> {
    try {
      const user = await User.findOne({ email: data.email });
      if (!user) {
        throw new Error('User not found');
      }

      const isMatch = await user.comparePassword(data.password);
      if (!isMatch) {
        throw new Error('Invalid password');
      }

      const token = this.generateToken(user);

      return {
        token,
        user: {
          _id: user._id.toString(),
          email: user.email,
          name: user.name,
          username: user.username,
          role: user.role,
          isAdmin: user.isAdmin
        }
      };
    } catch (error) {
      logger.error('Error in login:', error);
      throw error;
    }
  }

  async verifyToken(token: string): Promise<IUser> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as TokenPayload;
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      return this.convertToIUser(user);
    } catch (error) {
      logger.error('Error in verifyToken:', error);
      throw new AppError('Invalid token', 401);
    }
  }

  // 新增：获取当前用户
  async getCurrentUser(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId);
    return user ? this.convertToIUser(user) : null;
  }

  // 新增：更新用户
  async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    return user ? this.convertToIUser(user) : null;
  }

  // 新增：修改密码
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) throw new AppError('Current password is incorrect', 400);
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return true;
  }

  // 新增：登出（可扩展为 token 黑名单等，这里仅做日志记录）
  async logout(userId: string): Promise<boolean> {
    logger.info(`User ${userId} logged out`);
    return true;
  }
} 