import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  username: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  level: number;
  permissions: string[];
  referrerId?: Types.ObjectId;
  referrer?: string;
  isAdmin: boolean;
  balance: number;
}

export interface IUserDocument extends Document {
  username: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  level: number;
  permissions: string[];
  referrerId?: Types.ObjectId;
  referrer?: string;
  isAdmin: boolean;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  level: {
    type: Number,
    default: 1
  },
  permissions: [{
    type: String
  }],
  referrerId: {
    type: Types.ObjectId,
    ref: 'User'
  },
  referrer: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  balance: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

userSchema.methods['comparePassword'] = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this['password']);
};

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this['password'] = await bcrypt.hash(this['password'], 10);
  }
  next();
});

export const User = model<IUserDocument>('User', userSchema);
export default User; 