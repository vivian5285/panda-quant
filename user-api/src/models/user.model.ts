import mongoose, { Schema, CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';
import { DatabaseError } from '../utils/errors';
import { validateEmail, validatePassword } from '../utils/validation';
import { IUser } from '../types/user.types';

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
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
      enum: ['user', 'admin'],
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
      type: Schema.Types.Mixed,
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
    },
    walletAddress: {
      type: String,
      default: undefined
    },
    totalDeposits: {
      type: Number,
      default: 0
    },
    accountBalance: {
      type: Number,
      default: 0
    },
    subscriptionFee: {
      type: Number,
      default: 0
    },
    depositAddresses: [{
      chain: String,
      address: String
    }],
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date
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

// Static methods
userSchema.statics.findByEmail = async function(email: string) {
  return this.findOne({ email });
};

userSchema.statics.updateVerificationCode = async function(userId: string, code: string, expires: Date) {
  try {
    await this.findByIdAndUpdate(userId, {
      verificationCode: code,
      verificationCodeExpires: expires
    });
  } catch (error) {
    throw new DatabaseError('Failed to update verification code');
  }
};

userSchema.statics.verifyEmail = async function(userId: string) {
  try {
    await this.findByIdAndUpdate(userId, {
      isVerified: true,
      verificationCode: undefined,
      verificationCodeExpires: undefined
    });
  } catch (error) {
    throw new DatabaseError('Failed to verify email');
  }
};

// 检查模型是否已经存在
export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema); 