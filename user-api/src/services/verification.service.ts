import { AuthUser } from '../middleware/auth';
import User from '../models/User';
import { ValidationError } from '../utils/errors';
import { generateToken, verifyToken } from '../utils/jwt';
import { sendEmail, sendVerificationEmail } from '../utils/email';
import { User as UserModel } from '../models/user.model';
import { Verification } from '../models/verification.model';

const VERIFICATION_CODE_LENGTH = 6;
const MAX_ATTEMPTS = 3;

export class VerificationService {
  private readonly EMAIL_VERIFICATION_EXPIRY = '24h';
  private readonly PASSWORD_RESET_EXPIRY = '1h';
  private readonly CODE_EXPIRY = 300; // 5 minutes
  private codeCache: Map<string, { code: string; expiry: number }> = new Map();

  async generateCode(type: 'register' | 'login' | 'reset', email: string): Promise<string> {
    try {
      const code = Math.random().toString().slice(2, 2 + VERIFICATION_CODE_LENGTH);
      await Verification.create({
        userId: email,
        code,
        type,
        attempts: 0
      });
      return code;
    } catch (error) {
      console.error('Error generating verification code:', error);
      throw error;
    }
  }

  async verifyCode(email: string, code: string, type: 'email' | 'password'): Promise<boolean> {
    try {
      const verification = await Verification.findOne({
        userId: email,
        code,
        type,
        attempts: { $lt: MAX_ATTEMPTS }
      });

      if (!verification) {
        throw new Error('Invalid or expired verification code');
      }

      await verification.deleteOne();
      return true;
    } catch (error) {
      console.error('Error verifying code:', error);
      throw error;
    }
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

  async sendPasswordResetEmail(user: AuthUser): Promise<void> {
    try {
      const token = generateToken(user);
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

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
    } catch (error) {
      throw new ValidationError('Failed to send password reset email');
    }
  }

  async verifyEmailToken(token: string): Promise<string> {
    try {
      const user = await verifyToken(token);
      return user.id;
    } catch (error) {
      throw new ValidationError('Invalid or expired token');
    }
  }

  async verifyPasswordResetToken(token: string): Promise<string> {
    try {
      const user = await verifyToken(token);
      return user.id;
    } catch (error) {
      throw new ValidationError('Invalid or expired token');
    }
  }

  async verifyUser(user: AuthUser): Promise<boolean> {
    try {
      const userDoc = await User.findById(user.id);
      if (!userDoc) {
        throw new ValidationError('User not found');
      }
      
      userDoc.isVerified = true;
      await userDoc.save();
      
      return true;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError('Failed to verify user');
    }
  }
} 