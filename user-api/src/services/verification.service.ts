import { IUser } from '../models/User';
import { ValidationError } from '../utils/errors';
import { generateToken, verifyToken } from '../utils/jwt';
import { sendEmail, sendVerificationEmail } from '../utils/email';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VerificationService {
  private readonly EMAIL_VERIFICATION_EXPIRY = '24h';
  private readonly PASSWORD_RESET_EXPIRY = '1h';
  private readonly CODE_EXPIRY = 300; // 5 minutes
  private codeCache: Map<string, { code: string; expiry: number }> = new Map();

  async generateCode(type: 'register' | 'login' | 'reset', email: string): Promise<string> {
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = Date.now() + this.CODE_EXPIRY * 1000;
      
      // 存储验证码到内存缓存
      this.codeCache.set(`${type}:${email}`, { code, expiry });
      
      // 清理过期验证码
      this.cleanupExpiredCodes();
      
      // 发送验证码邮件
      await sendVerificationEmail(email, code);
      
      return code;
    } catch (error) {
      // 如果发送邮件失败，从缓存中删除验证码
      this.codeCache.delete(`${type}:${email}`);
      throw new ValidationError('Failed to send verification code: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async verifyCode(email: string, code: string, type: 'register' | 'reset-password'): Promise<boolean> {
    const key = `${type}:${email}`;
    const stored = this.codeCache.get(key);
    
    if (!stored) {
      return false;
    }
    
    // 检查是否过期
    if (Date.now() > stored.expiry) {
      this.codeCache.delete(key);
      return false;
    }
    
    // 验证码正确，删除验证码
    if (stored.code === code) {
      this.codeCache.delete(key);
      return true;
    }
    
    return false;
  }

  private cleanupExpiredCodes() {
    const now = Date.now();
    for (const [key, value] of this.codeCache.entries()) {
      if (now > value.expiry) {
        this.codeCache.delete(key);
      }
    }
  }

  async sendVerificationEmail(email: string, type: 'register' | 'reset-password'): Promise<void> {
    const code = await this.generateCode(type === 'register' ? 'register' : 'reset', email);
    
    if (process.env.NODE_ENV !== 'test') {
      await sendEmail({
        to: email,
        subject: type === 'register' ? 'Verify your email' : 'Reset your password',
        text: `Your verification code is: ${code}`,
        html: `
          <h1>${type === 'register' ? 'Email Verification' : 'Password Reset'}</h1>
          <p>Your verification code is: <strong>${code}</strong></p>
          <p>This code will expire in 5 minutes.</p>
        `
      });
    }
  }

  async sendPasswordResetEmail(user: IUser): Promise<void> {
    const token = generateToken(user, this.PASSWORD_RESET_EXPIRY);
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    if (process.env.NODE_ENV !== 'test') {
      await sendEmail({
        to: user.email,
        subject: 'Reset your password',
        text: `Please click the following link to reset your password: ${resetUrl}`,
        html: `
          <h1>Password Reset</h1>
          <p>Please click the following link to reset your password:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>This link will expire in 1 hour.</p>
        `
      });
    }
  }

  async verifyEmailToken(token: string): Promise<string> {
    try {
      const decoded = verifyToken(token);
      return decoded.userId;
    } catch (error) {
      throw new ValidationError('Invalid or expired token');
    }
  }

  async verifyPasswordResetToken(token: string): Promise<string> {
    try {
      const decoded = verifyToken(token);
      return decoded.userId;
    } catch (error) {
      throw new ValidationError('Invalid or expired token');
    }
  }
} 