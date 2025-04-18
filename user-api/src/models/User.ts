import mongoose, { Schema, Document } from 'mongoose';
import { DatabaseError } from '../utils/errors';

export interface IUserInput {
  email: string;
  password: string;
  name: string;
  username: string;
  isVerified?: boolean;
}

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  username: string;
  isVerified: boolean;
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
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 删除所有索引并重新创建
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });

const User = mongoose.model<IUser>('User', userSchema);

export class UserModel {
  async createUser(userData: IUserInput): Promise<IUser> {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      console.error('Detailed error:', error);
      if (error instanceof Error) {
        if (error.name === 'MongoError' && (error as any).code === 11000) {
          throw new DatabaseError('Email already exists');
        }
        throw new DatabaseError(`Error creating user: ${error.message}`);
      }
      throw new DatabaseError('Error creating user');
    }
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw new DatabaseError('Error finding user');
    }
  }

  async findUserById(id: string): Promise<IUser | null> {
    try {
      return await User.findById(id);
    } catch (error) {
      throw new DatabaseError('Error finding user');
    }
  }

  async updateUser(id: string, update: Partial<IUser>): Promise<IUser> {
    try {
      const user = await User.findByIdAndUpdate(id, update, { new: true });
      if (!user) {
        throw new DatabaseError('User not found');
      }
      return user;
    } catch (error) {
      throw new DatabaseError('Error updating user');
    }
  }

  async verifyUser(id: string): Promise<IUser> {
    try {
      const user = await User.findByIdAndUpdate(id, { isVerified: true }, { new: true });
      if (!user) {
        throw new DatabaseError('User not found');
      }
      return user;
    } catch (error) {
      throw new DatabaseError('Error verifying user');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const result = await User.findByIdAndDelete(id);
      if (!result) {
        throw new DatabaseError('User not found');
      }
    } catch (error) {
      throw new DatabaseError('Error deleting user');
    }
  }
} 