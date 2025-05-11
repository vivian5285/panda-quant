import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserRole, UserStatus, UserLevel } from '../types/Enums';
import { IUser } from '../types/User';

export interface IUserDocument extends Document, Omit<IUser, '_id'> {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  level: UserLevel;
  isAdmin: boolean;
  permissions: string[];
  resetToken?: string;
  balance: {
    available: number;
    locked: number;
    currency: string;
  };
  settings: {
    twoFactorEnabled: boolean;
    notificationPreferences: {
      email: boolean;
      telegram: boolean;
      push: boolean;
    };
    tradingPreferences: {
      defaultLeverage: number;
      defaultMarginType: string;
      defaultTimeInForce: string;
    };
  };
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
  status: { type: String, enum: Object.values(UserStatus), default: UserStatus.ACTIVE },
  level: { type: String, enum: Object.values(UserLevel), default: UserLevel.BRONZE },
  isAdmin: { type: Boolean, default: false },
  permissions: [{ type: String }],
  resetToken: String,
  balance: {
    available: { type: Number, default: 0 },
    locked: { type: Number, default: 0 },
    currency: { type: String, default: 'USDT' }
  },
  settings: {
    twoFactorEnabled: { type: Boolean, default: false },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      telegram: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    tradingPreferences: {
      defaultLeverage: { type: Number, default: 1 },
      defaultMarginType: { type: String, default: 'isolated' },
      defaultTimeInForce: { type: String, default: 'GTC' }
    }
  },
  metadata: { type: Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUserDocument>('User', userSchema);
export { User };
export default User; 