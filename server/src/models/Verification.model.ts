import mongoose, { Document, Schema } from 'mongoose';
import { DatabaseError } from '../utils/Errors';

export interface VerificationCode extends Document {
  email: string;
  code: string;
  type: 'register' | 'reset-password';
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const verificationSchema = new Schema<VerificationCode>({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  code: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['register', 'reset-password'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// 创建索引
verificationSchema.index({ email: 1 });
verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const VerificationCode = mongoose.model<VerificationCode>('VerificationCode', verificationSchema);

export class Verification {
  static async create(email: string, code: string, type: 'register' | 'reset-password'): Promise<VerificationCode> {
    try {
      // 设置验证码过期时间为10分钟
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      
      const verification = new VerificationCode({
        email,
        code,
        type,
        expiresAt,
      });

      return await verification.save();
    } catch (error) {
      throw new DatabaseError('Error creating verification code');
    }
  }

  static async findByEmailAndCode(email: string, code: string, type: 'register' | 'reset-password'): Promise<VerificationCode | null> {
    try {
      return await VerificationCode.findOne({
        email,
        code,
        type,
        expiresAt: { $gt: new Date() }
      }).exec();
    } catch (error) {
      throw new DatabaseError('Error finding verification code');
    }
  }

  static async markAsUsed(id: string): Promise<void> {
    try {
      await VerificationCode.findByIdAndUpdate(id, { isUsed: true }).exec();
    } catch (error) {
      throw new DatabaseError('Error marking verification code as used');
    }
  }

  static async deleteByEmail(email: string, type: 'register' | 'reset-password'): Promise<void> {
    try {
      await VerificationCode.deleteMany({ email, type }).exec();
    } catch (error) {
      throw new DatabaseError('Error deleting verification codes');
    }
  }
} 