import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  isVerified: boolean;
  role: 'user' | 'admin';
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  walletAddress?: string;
  totalDeposits: number;
  accountBalance: number;
  subscriptionFee: number;
  depositAddresses: Array<{
    chain: string;
    address: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  verificationToken: String,
  verificationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  verificationCode: String,
  verificationCodeExpires: Date,
  walletAddress: String,
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
  }]
}, {
  timestamps: true
});

export const User = model<IUser>('User', userSchema);
export const UserModel: Model<IUser> = User; 