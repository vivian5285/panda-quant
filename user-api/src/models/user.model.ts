import { Schema, model, Document, SchemaTypes, CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';
import { DatabaseError } from '../utils/errors';
import { validateEmail, validatePassword } from '../utils/validation';

export interface User extends Document {
  email: string;
  password: string;
  name: string;
  role: string;
  status: string;
  isAdmin: boolean;
  permissions: Record<string, boolean>;
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: {
        validator: validateEmail,
        message: 'Invalid email format'
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      validate: {
        validator: validatePassword,
        message: 'Password must be at least 8 characters long'
      }
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      default: 'user'
    },
    status: {
      type: String,
      default: 'active'
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    permissions: {
      type: SchemaTypes.Mixed,
      default: {}
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationCode: {
      type: String,
      default: undefined
    },
    verificationCodeExpires: {
      type: Date,
      default: undefined
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = model<User>('User', userSchema);

// 静态方法
export class User {
  static async findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email });
  }

  static async create(userData: Partial<User>): Promise<User> {
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