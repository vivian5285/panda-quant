import { ValidationError } from '../utils/errors';
import { generateToken, verifyToken } from '../utils/jwt';
import { sendEmail } from '../utils/email';
import { Verification } from '../models/verification.model';
import { User, IUser } from '../models/User';
import { VerificationCode } from '../models/verification.model';
import { VerificationUser, VerificationType } from '../types/verification.types';
import mongoose from 'mongoose';

const VERIFICATION_CODE_LENGTH = 6;

export class VerificationService {
  async generateCode(type: VerificationType, email: string): Promise<string> {
    try {
      const code = Math.random().toString().slice(2, 2 + VERIFICATION_CODE_LENGTH);
      await Verification.create(email, code, type);
      return code;
    } catch (error) {
      console.error('Error generating verification code:', error);
      throw error;
    }
  }

  async verifyCode(email: string, code: string, type: VerificationType): Promise<boolean> {
    try {
      const verification = await Verification.findByEmailAndCode(email, code, type);
      if (!verification) {
        throw new Error('Invalid or expired verification code');
      }
      if (!verification._id) {
        throw new Error('Invalid verification record');
      }
      await Verification.markAsUsed(verification._id.toString());
      return true;
    } catch (error) {
      console.error('Error verifying code:', error);
      throw error;
    }
  }

  async sendVerificationEmail(user: VerificationUser): Promise<void> {
    await VerificationCode.create({
      email: user.email,
      code: user.verificationCode,
      type: 'register',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    await sendEmail({
      to: user.email,
      subject: 'Verify your email',
      text: `Your verification code is: ${user.verificationCode}`
    });
  }

  async verifyEmailCode(code: string): Promise<void> {
    const verification = await VerificationCode.findOne({
      code,
      type: 'register',
      expiresAt: { $gt: new Date() }
    });

    if (!verification) {
      throw new Error('Invalid or expired verification code');
    }

    await User.findOneAndUpdate(
      { email: verification.email },
      { isVerified: true }
    );

    await VerificationCode.deleteOne({ _id: verification._id });
  }

  async sendPasswordResetEmail(user: IUser): Promise<void> {
    const token = generateToken({ 
      id: (user._id as mongoose.Types.ObjectId).toString(), 
      email: user.email,
      role: user.role
    });
    await VerificationCode.create({
      email: user.email,
      code: token,
      type: 'reset-password',
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour
    });

    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      text: `Click here to reset your password: ${process.env.FRONTEND_URL}/reset-password?token=${token}`,
      html: `
        <h1>Password Reset</h1>
        <p>Click the following link to reset your password:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `
    });
  }

  async resetPassword(token: string, hashedPassword: string): Promise<void> {
    const verification = await VerificationCode.findOne({
      code: token,
      type: 'reset-password',
      expiresAt: { $gt: new Date() }
    });

    if (!verification) {
      throw new Error('Invalid or expired reset token');
    }

    await User.findOneAndUpdate(
      { email: verification.email },
      { password: hashedPassword }
    );

    await VerificationCode.deleteOne({ _id: verification._id });
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
} 