import { User, UserModel } from '../models/user.model';
import bcrypt from 'bcrypt';
import { DatabaseError } from '../utils/errors';
import { UserRepository } from '../repositories/user.repository';
import { Model } from 'mongoose';

export class UserService {
  private userModel = UserModel;

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.userModel.findOne({ email });
    } catch (error) {
      throw new DatabaseError('Error finding user by email');
    }
  }

  async createUser(userData: Partial<User>): Promise<User> {
    try {
      // Hash password before saving
      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);
      }
      
      const user = new this.userModel(userData);
      return await user.save();
    } catch (error) {
      throw new DatabaseError('Error creating user');
    }
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User | null> {
    try {
      return await this.userModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );
    } catch (error) {
      throw new DatabaseError('Error updating user');
    }
  }

  async verifyEmail(email: string): Promise<User | null> {
    try {
      return await this.userModel.findOneAndUpdate(
        { email },
        { $set: { isEmailVerified: true } },
        { new: true }
      );
    } catch (error) {
      throw new DatabaseError('Error verifying email');
    }
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await UserRepository.findByEmail(email);
      if (!user) return null;

      const isValid = await bcrypt.compare(password, user.password);
      return isValid ? user : null;
    } catch (error) {
      throw new DatabaseError('Failed to validate user', error);
    }
  }

  static async deleteUser(id: string): Promise<boolean> {
    try {
      return await UserRepository.delete(id);
    } catch (error) {
      throw new DatabaseError('Failed to delete user', error);
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      return await UserRepository.findById(id);
    } catch (error) {
      throw new DatabaseError('Failed to get user', error);
    }
  }

  static async getAllUsers(page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number }> {
    try {
      return await UserRepository.findAll(page, limit);
    } catch (error) {
      throw new DatabaseError('Failed to get users', error);
    }
  }
} 