import { Controller, Post, Body, HttpException, HttpStatus, Request, Response } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { VerificationService } from '../services/verification.service';
import { User, UserModel } from '../models/user.model';
import { DatabaseError } from '../utils/errors';
import { sendVerificationEmail } from '../utils/email';
import { generateToken } from '../utils/auth';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly verificationService: VerificationService
  ) {}

  @Post('send-code')
  async sendCode(@Body() body: { email: string; type: 'register' | 'reset-password' }) {
    const { email, type } = body;

    // 如果是注册，检查邮箱是否已存在
    if (type === 'register') {
      const existingUser = await this.userService.getUserByEmail(email);
      if (existingUser) {
        throw new HttpException('该邮箱已被注册', HttpStatus.BAD_REQUEST);
      }
    }

    // 生成并发送验证码
    await this.verificationService.sendVerificationEmail(email, type);
    return { message: '验证码已发送' };
  }

  @Post('register')
  async register(req: Request, res: Response) {
    try {
      const { email, password, username } = req.body;

      // 检查邮箱是否已存在
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // 创建新用户
      const user = await UserModel.create({
        email,
        password,
        username,
        role: 'user',
        status: 'active',
        isAdmin: false,
        permissions: {},
        isVerified: false
      });

      // 生成验证码
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24小时后过期

      // 更新用户验证信息
      await UserModel.updateVerificationCode(user._id, verificationCode, verificationCodeExpires);

      // 发送验证邮件
      await sendVerificationEmail(email, verificationCode);

      // 生成 JWT token
      const token = generateToken(user._id);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          isVerified: user.isVerified
        }
      });
    } catch (error) {
      if (error instanceof DatabaseError) {
        res.status(400).json({ message: error.message });
      } else {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    // 验证用户
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new HttpException('邮箱或密码错误', HttpStatus.UNAUTHORIZED);
    }

    return { message: '登录成功', user };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; newPassword: string; code: string }) {
    const { email, newPassword, code } = body;

    // 验证验证码
    const isValid = await this.verificationService.verifyCode(email, code, 'reset-password');
    if (!isValid) {
      throw new HttpException('验证码无效或已过期', HttpStatus.BAD_REQUEST);
    }

    // 重置密码
    await this.userService.resetPassword(email, newPassword);
    return { message: '密码重置成功' };
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const { email, code } = req.body;
      const user = await UserModel.findByEmail(email);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.isVerified) {
        return res.status(400).json({ message: 'Email already verified' });
      }

      if (!user.verificationCode || !user.verificationCodeExpires) {
        return res.status(400).json({ message: 'No verification code found' });
      }

      if (user.verificationCode !== code) {
        return res.status(400).json({ message: 'Invalid verification code' });
      }

      if (user.verificationCodeExpires < new Date()) {
        return res.status(400).json({ message: 'Verification code expired' });
      }

      await UserModel.verifyEmail(user._id);

      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      if (error instanceof DatabaseError) {
        res.status(400).json({ message: error.message });
      } else {
        console.error('Verification error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
} 