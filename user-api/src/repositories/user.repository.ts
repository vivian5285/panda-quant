import { UserModel, User } from '../models/user.model';
import { WithId, Document } from 'mongodb';
import { DatabaseError } from '../utils/errors';

export class UserRepository {
  static async create(userData: Partial<User>): Promise<User> {
    try {
      const user = new UserModel(userData);
      return await user.save();
    } catch (error) {
      throw new DatabaseError('Failed to create user', error);
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      throw new DatabaseError('Failed to find user by email', error);
    }
  }

  static async findById(id: string): Promise<User | null> {
    try {
      return await UserModel.findById(id);
    } catch (error) {
      throw new DatabaseError('Failed to find user by id', error);
    }
  }

  static async update(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      return await UserModel.findByIdAndUpdate(
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
      const result = await UserModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new DatabaseError('Failed to delete user', error);
    }
  }

  static async findAll(page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const [users, total] = await Promise.all([
        UserModel.find().skip(skip).limit(limit).select('-password'),
        UserModel.countDocuments()
      ]);
      return { users, total };
    } catch (error) {
      throw new DatabaseError('Failed to find users', error);
    }
  }
} 