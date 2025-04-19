import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { DatabaseError } from '../utils/errors';

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  role: string;
  status: string;
  isAdmin: boolean;
  permissions: Record<string, boolean>;
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  role: { type: String, default: 'user' },
  status: { type: String, default: 'active' },
  isAdmin: { type: Boolean, default: false },
  permissions: { type: Schema.Types.Mixed, default: {} },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  verificationCodeExpires: { type: Date }
}, {
  timestamps: true
});

// 密码加密中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 验证密码方法
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new DatabaseError('Password comparison failed');
  }
};

export const UserModel = mongoose.model<IUser>('User', userSchema);

// 静态方法
export class User {
  static async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }

  static async create(userData: Partial<IUser>): Promise<IUser> {
    try {
      return await UserModel.create(userData);
    } catch (error) {
      throw new DatabaseError('Failed to create user');
    }
  }

  static async updateVerificationCode(userId: string, code: string, expires: Date): Promise<void> {
    try {
      await UserModel.findByIdAndUpdate(userId, {
        verificationCode: code,
        verificationCodeExpires: expires
      });
    } catch (error) {
      throw new DatabaseError('Failed to update verification code');
    }
  }

  static async verifyEmail(userId: string): Promise<void> {
    try {
      await UserModel.findByIdAndUpdate(userId, {
        isVerified: true,
        verificationCode: undefined,
        verificationCodeExpires: undefined
      });
    } catch (error) {
      throw new DatabaseError('Failed to verify email');
    }
  }
} 