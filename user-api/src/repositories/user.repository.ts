import { User } from '../models/user.model';
import { IUser } from '../types/user.types';
import { DatabaseError } from '../utils/errors';

export class UserRepository {
  static async create(userData: Partial<IUser>): Promise<IUser> {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw new DatabaseError('Failed to create user', error);
    }
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw new DatabaseError('Failed to find user by email', error);
    }
  }

  static async findById(id: string): Promise<IUser | null> {
    try {
      return await User.findById(id);
    } catch (error) {
      throw new DatabaseError('Failed to find user by id', error);
    }
  }

  static async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(
        id,
        { $set: userData },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new DatabaseError('Failed to update user', error);
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const result = await User.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new DatabaseError('Failed to delete user', error);
    }
  }

  static async findAll(page: number = 1, limit: number = 10): Promise<{ users: IUser[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const users = await User.find().skip(skip).limit(limit);
      const total = await User.countDocuments();
      return { users, total };
    } catch (error) {
      throw new DatabaseError('Failed to find users', error);
    }
  }
} 