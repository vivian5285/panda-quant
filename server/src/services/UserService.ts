import { User } from '../models/User.model';
import { IUser, IUserDocument, UserCreateInput, UserUpdateInput } from '../types/User';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/Logger';
import { Types } from 'mongoose';

export class UserService {
  private static instance: UserService;

  private constructor() {}

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  private convertToIUser(user: IUserDocument): IUser {
    return {
      _id: user._id,
      email: user.email,
      username: user.username,
      password: user.password,
      name: user.name,
      role: user.role,
      status: user.status,
      level: user.level,
      isAdmin: user.isAdmin,
      permissions: user.permissions,
      balance: user.balance,
      accountBalance: user.accountBalance,
      subscriptionFee: user.subscriptionFee,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      comparePassword: user.comparePassword.bind(user)
    };
  }

  async createUser(data: UserCreateInput): Promise<IUserDocument> {
    try {
      const user = new User(data);
      return await user.save();
    } catch (error) {
      logger.error('Error creating user:', error);
      throw new AppError('Failed to create user', 500);
    }
  }

  async getUserById(id: string): Promise<IUserDocument | null> {
    try {
      return await User.findById(id);
    } catch (error) {
      logger.error('Error getting user:', error);
      throw new AppError('Failed to get user', 500);
    }
  }

  async getUserByEmail(email: string): Promise<IUserDocument | null> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      logger.error('Error getting user by email:', error);
      throw new AppError('Failed to get user by email', 500);
    }
  }

  async getAllUsers(): Promise<IUserDocument[]> {
    try {
      return await User.find();
    } catch (error) {
      logger.error('Error getting all users:', error);
      throw new AppError('Failed to get users', 500);
    }
  }

  async updateUser(id: string, data: UserUpdateInput): Promise<IUserDocument | null> {
    try {
      return await User.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      logger.error('Error updating user:', error);
      throw new AppError('Failed to update user', 500);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await User.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw new AppError('Failed to delete user', 500);
    }
  }

  async updateUserBalance(userId: string, amount: number): Promise<IUserDocument | null> {
    try {
      return await User.findByIdAndUpdate(
        userId,
        { $inc: { balance: amount } },
        { new: true }
      );
    } catch (error) {
      logger.error('Error updating user balance:', error);
      throw new AppError('Failed to update user balance', 500);
    }
  }
}

export const userService = UserService.getInstance(); 