import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { DatabaseError } from '../utils/errors';

export interface IUser extends Document {
  email: string;
  username?: string;
  password: string;
  walletAddress?: string;
  role: string;
  status: string;
  isAdmin: boolean;
  adminType?: string;
  permissions: any;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  walletAddress: { type: String, unique: true, sparse: true },
  role: { type: String, default: 'user' },
  status: { type: String, default: 'active' },
  isAdmin: { type: Boolean, default: false },
  adminType: { type: String },
  permissions: { type: Schema.Types.Mixed },
  lastLogin: { type: Date },
}, {
  timestamps: true
});

// 密码哈希中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// 密码验证方法
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export const User = mongoose.model<IUser>('User', userSchema);

export class UserModel {
  async findByEmail(email: string): Promise<IUser | null> {
    try {
      const result = await User.findOne({ email }).exec();
      return result || null;
    } catch (error) {
      throw new DatabaseError('Error finding user by email', error);
    }
  }

  async findByUsername(username: string): Promise<IUser | null> {
    try {
      const result = await User.findOne({ username }).exec();
      return result || null;
    } catch (error) {
      throw new DatabaseError('Error finding user by username', error);
    }
  }

  async findById(id: string): Promise<IUser | null> {
    try {
      const result = await User.findById(id).exec();
      return result || null;
    } catch (error) {
      throw new DatabaseError('Error finding user by id', error);
    }
  }

  async findByWalletAddress(walletAddress: string): Promise<IUser | null> {
    try {
      const result = await User.findOne({ walletAddress }).exec();
      return result || null;
    } catch (error) {
      throw new DatabaseError('Error finding user by wallet address', error);
    }
  }

  async create(email: string, password: string, walletAddress?: string): Promise<IUser> {
    try {
      const user = new User({
        email,
        password,
        walletAddress: walletAddress || null
      });
      const result = await user.save();
      return result;
    } catch (error) {
      throw new DatabaseError('Error creating user', error);
    }
  }

  async updateUsername(id: string, username: string): Promise<IUser | null> {
    try {
      const result = await User.findByIdAndUpdate(id, { username }, { new: true }).exec();
      return result;
    } catch (error) {
      throw new DatabaseError('Error updating username', error);
    }
  }

  async updateStatus(id: string, status: string): Promise<IUser | null> {
    try {
      const result = await User.findByIdAndUpdate(id, { status }, { new: true }).exec();
      return result;
    } catch (error) {
      throw new DatabaseError('Error updating user status', error);
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    try {
      await User.findByIdAndUpdate(id, { lastLogin: Date.now() }).exec();
    } catch (error) {
      throw new DatabaseError('Error updating last login', error);
    }
  }

  async verifyPassword(user: IUser, password: string): Promise<boolean> {
    try {
      return await user.comparePassword(password);
    } catch (error) {
      throw new DatabaseError('Error verifying password', error);
    }
  }

  async findAllUsers(page: number = 1, limit: number = 10): Promise<{ users: IUser[], total: number }> {
    try {
      const offset = (page - 1) * limit;
      const [usersResult, countResult] = await Promise.all([
        User.find().sort({ createdAt: -1 }).skip(offset).limit(limit).exec(),
        User.countDocuments().exec()
      ]);
      
      return {
        users: usersResult,
        total: countResult
      };
    } catch (error) {
      throw new DatabaseError('Error finding users', error);
    }
  }

  async updateUserRole(id: string, role: string, isAdmin: boolean, adminType?: string): Promise<IUser | null> {
    try {
      const result = await User.findByIdAndUpdate(id, { role, isAdmin, adminType }, { new: true }).exec();
      return result;
    } catch (error) {
      throw new DatabaseError('Error updating user role', error);
    }
  }

  async updateUserPermissions(id: string, permissions: any): Promise<IUser | null> {
    try {
      const result = await User.findByIdAndUpdate(id, { permissions }, { new: true }).exec();
      return result;
    } catch (error) {
      throw new DatabaseError('Error updating user permissions', error);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await User.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new DatabaseError('Error deleting user', error);
    }
  }

  async searchUsers(query: string, page: number = 1, limit: number = 10): Promise<{ users: IUser[], total: number }> {
    try {
      const offset = (page - 1) * limit;
      const searchPattern = new RegExp(query, 'i');
      
      const [usersResult, countResult] = await Promise.all([
        User.find({
          $or: [
            { email: searchPattern },
            { username: searchPattern }
          ]
        }).sort({ createdAt: -1 }).skip(offset).limit(limit).exec(),
        User.countDocuments({
          $or: [
            { email: searchPattern },
            { username: searchPattern }
          ]
        }).exec()
      ]);
      
      return {
        users: usersResult,
        total: countResult
      };
    } catch (error) {
      throw new DatabaseError('Error searching users', error);
    }
  }

  async findByRole(role: string, page: number = 1, limit: number = 10): Promise<{ users: IUser[], total: number }> {
    try {
      const offset = (page - 1) * limit;
      const [usersResult, countResult] = await Promise.all([
        User.find({ role }).sort({ createdAt: -1 }).skip(offset).limit(limit).exec(),
        User.countDocuments({ role }).exec()
      ]);
      
      return {
        users: usersResult,
        total: countResult
      };
    } catch (error) {
      throw new DatabaseError('Error finding users by role', error);
    }
  }

  async updateWalletAddress(id: string, walletAddress: string): Promise<IUser | null> {
    try {
      const result = await User.findByIdAndUpdate(id, { walletAddress }, { new: true }).exec();
      return result;
    } catch (error) {
      throw new DatabaseError('Error updating wallet address', error);
    }
  }
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
} 