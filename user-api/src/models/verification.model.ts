import mongoose, { Document, Model } from 'mongoose';
import { DatabaseError } from '../utils/errors';

export interface IVerification extends Document {
  email: string;
  code: string;
  type: 'register' | 'reset-password';
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const verificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['register', 'reset-password']
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 创建索引
verificationSchema.index({ email: 1 });
verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const VerificationModel = mongoose.model<IVerification>('Verification', verificationSchema);

export class Verification {
  static async create(email: string, code: string, type: 'register' | 'reset-password'): Promise<IVerification> {
    try {
      // 设置验证码过期时间为10分钟
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      
      const verification = new VerificationModel({
        email,
        code,
        type,
        expiresAt,
      });

      return await verification.save();
    } catch (error) {
      throw new DatabaseError('Error creating verification code', error);
    }
  }

  static async findByEmailAndCode(email: string, code: string, type: 'register' | 'reset-password'): Promise<IVerification | null> {
    try {
      return await VerificationModel.findOne({
        email,
        code,
        type,
        isUsed: false,
        expiresAt: { $gt: new Date() }
      }).exec();
    } catch (error) {
      throw new DatabaseError('Error finding verification code', error);
    }
  }

  static async markAsUsed(id: string): Promise<void> {
    try {
      await VerificationModel.findByIdAndUpdate(id, { isUsed: true }).exec();
    } catch (error) {
      throw new DatabaseError('Error marking verification code as used', error);
    }
  }

  static async deleteByEmail(email: string, type: 'register' | 'reset-password'): Promise<void> {
    try {
      await VerificationModel.deleteMany({ email, type }).exec();
    } catch (error) {
      throw new DatabaseError('Error deleting verification codes', error);
    }
  }
}

export { VerificationModel }; 