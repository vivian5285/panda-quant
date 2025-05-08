import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  status: string;
  isAdmin: boolean;
  permissions: Record<string, boolean>;
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  isEmailVerified: boolean;
  walletAddress?: string;
  totalDeposits: number;
  accountBalance: number;
  subscriptionFee: number;
  depositAddresses: Array<{
    chain: string;
    address: string;
  }>;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserInput {
  email: string;
  password: string;
  name: string;
  username?: string;
  isVerified?: boolean;
  role?: 'user' | 'admin';
  walletAddress?: string;
}

export interface IUserDocument extends IUser {} 